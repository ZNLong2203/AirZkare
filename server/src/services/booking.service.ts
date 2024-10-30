import { PrismaClientInstance } from "../db/PrismaClient";
import { HttpException } from "../exceptions/HttpException";
import { randomUUID } from "crypto";
import { BookingFlightInfo } from '../interfaces/booking.interface';
import { Passenger } from "../interfaces/passsenger.interface";

const prisma = PrismaClientInstance();

class BookingService {
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
        if(!bookingData) throw new HttpException(400, 'No data');

        const bookingPending = await prisma.booking.findFirst({
            where: {
                user_id,
                status: 'pending',
            }
        })
        if (!bookingPending) {
            throw new HttpException(404, 'Booking not found');
        }

        if(bookingData.seat_come_id) {
            bookingData.seat_come_id.map(async (flight_seat_id) => {
                await prisma.flight_seat.update({
                    where: {
                        flight_seat_id,
                    },
                    data: {
                        passenger_id: user_id,
                        is_booked: true,
                    }
                })
            })
        }

        if(bookingData.seat_return_id) {
            bookingData.seat_return_id.map(async (flight_seat_id) => {
                await prisma.flight_seat.update({
                    where: {
                        flight_seat_id,
                    },
                    data: {
                        passenger_id: user_id,
                        is_booked: true,
                    }
                })
            })
        }

        return;
    }

    public async getPassengerBookingHistory(user_id: string): Promise<object> {
        const bookingData = await prisma.booking.findMany({
            where: {
                user_id,
            },
        })

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
}

export default BookingService;