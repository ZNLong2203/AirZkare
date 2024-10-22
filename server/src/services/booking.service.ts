import { PrismaClient } from "@prisma/client";
import { HttpException } from "../exceptions/HttpException";
import { randomUUID } from "crypto";
import { Passenger } from "../interfaces/passsenger.interface";

const prisma = new PrismaClient();

class BookingService {
    public async createBookingPassenger(user_id: string, bookingData: any): Promise<void> {
        if(!bookingData) throw new HttpException(400, 'No data');

        await prisma.booking.create({
            data: {
                user_id,
                booking_id: randomUUID(),
                status: 'pending',
            }
        })

        const passengerPromises = bookingData.map((passenger: Passenger) => {
            return prisma.passenger.create({
                data: {
                    ...passenger,
                    passenger_id: randomUUID(),
                    user_id: user_id,
                }
            })
        })

        await Promise.all(passengerPromises);

        return;
    }

    public async createBookingFlight(user_id: string, bookingData: any): Promise<void> {
        if(!bookingData) throw new HttpException(400, 'No data');

        const createBooking = await prisma.booking.findFirst({
            where: {
                user_id,
                status: 'pending',
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