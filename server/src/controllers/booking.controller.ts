import { Request, Response, NextFunction } from 'express';
import { Booking } from '../interfaces/booking.interface';
import { FlightSeat } from '../interfaces/flight_seat.interface';
import BookingService from '../services/booking.service';

class BookingController {
    public BookingService = new BookingService();

    public createBooking = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user_id  = req.user._id;
            const bookingData: object = req.body;

            const createBookingData: object = await this.BookingService.createBooking(user_id, bookingData);

            res.status(201).json({
                message: 'Booking created',
                metadata: createBookingData
            });
        } catch (error) {
            next(error);
        }
    }
}

export default BookingController;