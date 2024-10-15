import { Request, Response, NextFunction } from 'express';
import { Booking } from '../interfaces/booking.interface';
import { FlightSeat } from '../interfaces/flight_seat.interface';
import { User } from '../interfaces/user.interface';
import BookingService from '../services/booking.service';
import { RequestWithUser } from '../interfaces/auth.interface';

class BookingController {
    public BookingService = new BookingService();

    public createBooking = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Booking data:
            // flight_id: string;
            // seat_id: string;
            // flight_type: string;
            if (!req.user) {
                return res.status(401).json({
                    message: 'Unauthorized'
                });
            }

            const userData = req.user as any;
            const bookingData: object = req.body;

            const createBookingData = await this.BookingService.createBooking(userData.user_id, bookingData);

            res.status(201).json({
                message: 'Booking created',
                metadata: createBookingData
            });
        } catch (err) {
            next(err);
        }
    }

    public getPassengerBookingHistory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = req.user as any;
            const user_id = userData.user_id;

            const bookingData = await this.BookingService.getPassengerBookingHistory(user_id);

            res.status(200).json({
                message: 'Booking history fetched',
                metadata: bookingData
            });
        } catch (err) {
            next(err);
        }
    }

    public cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = req.user as any;
            const user_id = userData.user_id;
            const { booking_id } = req.params;
            
            const cancelBookingData = await this.BookingService.cancelBooking(user_id, booking_id);

            res.status(200).json({
                message: 'Booking cancelled',
            });
        } catch (err) {
            next(err);
        }
    }
}

export default BookingController;