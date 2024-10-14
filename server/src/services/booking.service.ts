import { PrismaClient } from "@prisma/client";
import { HttpException } from "../exceptions/HttpException";
import { Booking } from "../interfaces/booking.interface";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

class BookingService {
    public async createBooking(user_id: string, bookingData: object): Promise<object> {
        if(!bookingData) throw new HttpException(400, 'No data');

        const createBooking = await prisma.booking.create({
            data: {
                user_id,
                booking_id: randomUUID(),
                status: 'pending',
            }
        })

        return createBooking;
    }
}

export default BookingService;