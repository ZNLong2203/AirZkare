import { PrismaClient } from "@prisma/client";
import { HttpException } from "../exceptions/HttpException";
import { Booking } from "../interfaces/booking.interface";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

class BookingService {
    public async createBooking(user_id: string, bookingData: any): Promise<object> {
        if(!bookingData) throw new HttpException(400, 'No data');

        const createBooking = await prisma.booking.create({
            data: {
                user_id,
                booking_id: randomUUID(),
                status: 'pending',
            }
        })

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

        return createBooking;
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