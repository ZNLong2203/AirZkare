import { PrismaClientInstance } from "../db/PrismaClient";
import { HttpException } from "../exceptions/HttpException";
import { randomUUID } from "crypto";
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
            await prisma.booking.deleteMany({
                where: {
                    user_id,
                    status: 'pending',
                }
            })

            // Consider this logic
        }

        await prisma.booking.create({
            data: {
                user_id,
                booking_id: randomUUID(),
                status: 'pending',
            }
        })

        const passengerPromises = bookingData.passengersData.map((passenger: Passenger) => {
            return prisma.passenger.create({
                data: {
                    passenger_id: randomUUID(),
                    user_id: user_id,
                    name: passenger.name,
                    dob: new Date(passenger.dob),
                    gender: passenger.gender,
                    nationality: passenger.nationality,
                }
            })
        })

        await Promise.all(passengerPromises);

        return;
    }

    public async createBookingFlight(user_id: string, bookingData: any): Promise<void> {
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

        const createBooking = await prisma.booking.update({
            where: {
                booking_id: bookingPending.booking_id,
            },
            data: {
                status: 'confirmed',
            }
        })

        if (!createBooking) {
            throw new HttpException(404, 'Pending booking not found');
        }

        const flight_seat = await prisma.flight_seat.create({
            data: {
                flight_seat_id: randomUUID(),
                flight_id: bookingData.flight_id,
                seat_id: bookingData.seat_id,
                is_booked: true,
            }
        })

        await prisma.booking_flight.create({
            data: {
                booking_flight_id: randomUUID(),
                booking_id: createBooking.booking_id,
                flight_seat_id: flight_seat.flight_seat_id,
                flight_type: bookingData.flight_type,
            }
        })

        return;
    }

    public async getPassengerBookingHistory(user_id: string): Promise<object> {
        const bookingData = await prisma.booking.findMany({
            where: {
                user_id,
            },
            include: {
                booking_flight: {
                    include: {
                        flight_seat: true,
                    }
                }
            }
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

        await prisma.booking.update({
            where: {
                booking_id,
            },
            data: {
                status: 'cancelled',
            }
        })

        return;
    }
}

export default BookingService;