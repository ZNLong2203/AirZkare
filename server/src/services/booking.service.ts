import { PrismaClientInstance } from "../db/PrismaClient";
import { HttpException } from "../exceptions/HttpException";
import { randomUUID } from "crypto";
import { BookingFlightInfo } from '../interfaces/booking.interface';
import { Passenger } from "../interfaces/passsenger.interface";
import { validate as isUuidValid } from 'uuid';
import SocketSingleton from "../configs/socketSingleton.config";
import cron from "node-cron";
import moment from "moment";

const prisma = PrismaClientInstance();

class BookingService {
    constructor() {
        this.startSeatReleaseCronJob();
    }

    private startSeatReleaseCronJob() {
        cron.schedule('*/1 * * * *', async () => {
            try {
                const expiredSeats = await prisma.flight_seat.findMany({
                    where: {
                        hold_expires: { lt: new Date() },
                        is_booked: false,
                        held_by: { not: null },
                    }
                });
        
                if (expiredSeats.length > 0) {
                    await prisma.flight_seat.updateMany({
                        where: {
                            flight_seat_id: {
                                in: expiredSeats.map(seat => seat.flight_seat_id)
                            }
                        },
                        data: {
                            held_by: null,
                            held_at: null,
                            hold_expires: null,
                        }
                    });
                        
                    const io = SocketSingleton.getInstance();
                    expiredSeats.forEach(seat => {
                        io.emit('seatStatusChanged', {
                            seatId: seat.flight_seat_id,
                            status: 'available',
                        });
                        console.log(`Seat ${seat.flight_seat_id} status emitted as available.`);
                    });
                }
            } catch (error) {
                console.error('Error in cron job:', error);
            }
        })
    }

    public async createBookingPassenger(user_id: string, bookingData: any): Promise<void> {
        if(!bookingData) throw new HttpException(400, 'No data');

        const checkOtherBookingPending = await prisma.booking.findMany({
            where: {
                user_id,
                status: 'pending',
            }
        })

        if(checkOtherBookingPending.length > 0) {
            await prisma.$transaction(async (prisma) => {
                try {
                    await prisma.booking_passenger.deleteMany({
                        where: {
                            booking_id: {
                                in: checkOtherBookingPending.map(booking => booking.booking_id)
                            }
                        }
                    })
                    
                    await prisma.booking.deleteMany({
                        where: {
                            user_id,
                            status: 'pending',
                        }
                    })
                } catch (error) {
                    throw new HttpException(400, 'Error');
                }
            })
        }

        const bookingInfo = await prisma.booking.create({
            data: {
                user_id,
                booking_id: randomUUID(),
                status: 'pending',
            }
        })

        const passengerPromises = bookingData.passengersData.map(async (passenger: Passenger) => {
            const passengerData = await prisma.passenger.create({
                data: {
                    passenger_id: randomUUID(),
                    user_id: user_id,
                    name: passenger.name,
                    dob: new Date(passenger.dob),
                    gender: passenger.gender,
                    nationality: passenger.nationality,
                }
            });
            await prisma.booking_passenger.create({
                data: {
                    booking_passenger_id: randomUUID(),
                    booking_id: bookingInfo.booking_id,
                    passenger_id: passengerData.passenger_id,
                }
            });
        })

        await Promise.all(passengerPromises);

        return;
    }

    public async createBookingFlight(user_id: string, bookingData: BookingFlightInfo): Promise<void> {
        if (!bookingData) {
          throw new HttpException(400, 'No data');
        }
      
        if (!isUuidValid(user_id)) {
          throw new HttpException(400, 'Invalid user ID format');
        }
      
        const bookingPending = await prisma.booking.findFirst({
          where: {
            user_id,
            status: 'pending',
          },
        });
      
        if (!bookingPending) {
          throw new HttpException(404, 'Booking not found');
        }

        const bookingPassengerPending = await prisma.booking_passenger.findMany({
            where: {
                booking_id: bookingPending.booking_id,
            },
            select: {
                passenger_id: true,
            }
        })
            
        await prisma.$transaction(async (prisma) => {
          // Update seats for the come flight
          const passengerIds = bookingPassengerPending.map((bp) => bp.passenger_id);
          
          if (bookingData.seats_come_id && bookingData.seats_come_id.length > 0) {
            const invalidSeatIds = bookingData.seats_come_id.filter(id => !isUuidValid(id));
            if (invalidSeatIds.length > 0) {
                throw new HttpException(400, `Invalid seat IDs: ${invalidSeatIds.join(', ')}`);
            }

            if (bookingData.seats_come_id.length > passengerIds.length) {
                throw new HttpException(400, 'Not enough passengers for the seats');
            }
      
            await Promise.all(
              bookingData.seats_come_id.map(async (flight_seat_id, index) => {
                const passenger_id = passengerIds[index];
                await prisma.flight_seat.update({
                  where: {
                    flight_seat_id,
                  },
                  data: {
                    passenger_id,
                    is_booked: true,
                  },
                });
              })
            );
          }
      
          // Update seats for the return flight
          if (bookingData.seats_return_id && bookingData.seats_return_id.length > 0) {
            const invalidSeatIds = bookingData.seats_return_id.filter(id => !isUuidValid(id));
            if (invalidSeatIds.length > 0) {
                throw new HttpException(400, `Invalid seat IDs: ${invalidSeatIds.join(', ')}`);
            }

            if (bookingData.seats_return_id.length > passengerIds.length) {
                throw new HttpException(400, 'Not enough passengers for the seats');
            }
      
            await Promise.all(
              bookingData.seats_return_id.map(async (flight_seat_id, index) => {
                const passenger_id = passengerIds[index];
                await prisma.flight_seat.update({
                  where: {
                    flight_seat_id,
                  },
                  data: {
                    passenger_id,
                    is_booked: true,
                  },
                });
              })
            );
          }
        });
      
        return;
    }

    public async getPassengerBookingHistory(user_id: string): Promise<object[]> {
        const bookingData = await prisma.booking.findMany({
            where: {
                user_id,
            },
            select: {
                booking_id: true,
                status: true,
                time: true,
                booking_passenger: {
                    select: {
                        passenger: {
                            select: {
                                flight_seat: {
                                    select: {
                                        flight: {
                                            select: {
                                                flight_id: true,
                                                code: true,
                                                airport_flight_arrival_airportToairport: {
                                                    select: {
                                                        airport_id: true,
                                                        name: true,
                                                        location: true,
                                                    }
                                                },
                                                airport_flight_departure_airportToairport: {
                                                    select: {
                                                        airport_id: true,
                                                        name: true,
                                                        location: true,
                                                    }
                                                },
                                                departure_time: true,
                                                status: true,
                                                airplane: {
                                                    select: {
                                                        airplane_id: true,
                                                        name: true,
                                                        model: true,
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    
        return bookingData.map((booking) => ({
            id: booking.booking_id,
            flightNumber: booking.booking_passenger[0]?.passenger.flight_seat[0]?.flight.code,
            departure: `${booking.booking_passenger[0]?.passenger.flight_seat[0]?.flight.airport_flight_arrival_airportToairport.location} (${booking.booking_passenger[0]?.passenger.flight_seat[0]?.flight.airport_flight_arrival_airportToairport.name})`,
            arrival: `${booking.booking_passenger[0]?.passenger.flight_seat[0]?.flight.airport_flight_departure_airportToairport.location} (${booking.booking_passenger[0]?.passenger.flight_seat[0]?.flight.airport_flight_departure_airportToairport.name})`,
            date: moment(booking.time).format('YYYY-MM-DD'),
            status: booking.status,
        }));
    }

    public async getBookingInfo(booking_id: string): Promise<object> {
        const bookingData = await prisma.booking.findUnique({
            where: {
                booking_id,
            },
            select: {
                booking_id: true,
                status: true,
                time: true,
                type: true,
                payment: {
                    select: {
                        payment_id: true,
                        amount: true,
                        method: true,
                    }
                },
                booking_passenger: {
                    select: {
                        passenger: {
                            select: {
                                flight_seat: {
                                    select: {
                                        flight: {
                                            select: {
                                                flight_id: true,
                                                code: true,
                                                airport_flight_arrival_airportToairport: {
                                                    select: {
                                                        airport_id: true,
                                                        name: true,
                                                        location: true,
                                                    }
                                                },
                                                airport_flight_departure_airportToairport: {
                                                    select: {
                                                        airport_id: true,
                                                        name: true,
                                                        location: true,
                                                    }
                                                },
                                                departure_time: true,
                                                status: true,
                                                airplane: {
                                                    select: {
                                                        airplane_id: true,
                                                        name: true,
                                                        model: true,
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if(!bookingData) throw new HttpException(404, 'Booking not found');

        return bookingData;
    }

    public async cancelBooking(user_id: string, booking_id: string): Promise<void> {
        const bookingData = await prisma.booking.findFirst({
            where: {
                booking_id,
                user_id,
            }
        })

        if(!bookingData) throw new HttpException(404, 'Booking not found');

        await prisma.$transaction(async (prisma) => {
            try {
                await prisma.booking_passenger.deleteMany({
                    where: {
                        booking_id,
                    }
                })

                await prisma.booking.update({
                    where: {
                        booking_id,
                    },
                    data: {
                        status: 'cancelled',
                    }
                })

                await prisma.flight_seat.updateMany({
                    where: {
                        passenger_id: user_id,
                    },
                    data: {
                        passenger_id: null,
                        is_booked: false,
                    }
                })
            } catch (error) {
                throw new HttpException(400, 'Error');
            }
        })

        return;
    }

    public async holdSeat(user_id: string, flight_seat_id: string): Promise<void> {
        const seat = await prisma.flight_seat.findUnique({
            where: {
                flight_seat_id: flight_seat_id,
            }
        })

        if(!seat || seat.is_booked || seat.passenger_id) throw new HttpException(400, 'Seat not available');
        if(seat.held_by && seat.held_by !== user_id) throw new HttpException(400, 'Seat already held by another user');

        await prisma.flight_seat.update({
            where: {
                flight_seat_id,
            },
            data: {
                held_by: user_id,
                held_at: new Date(),
                hold_expires: moment().add(1, 'minutes').toDate(),
            }
        })

        const io = SocketSingleton.getInstance();
        io.emit('seatStatusChanged', {
            seatId: flight_seat_id,
            status: 'held',
            heldBy: user_id,
        })
    }
}

export default BookingService;