import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import authMiddleware from "../middlewares/auth.middleware";
import BookingController from "../controllers/booking.controller";

class BookingRoute implements Routes {
    public path = '/booking';
    public router = Router();
    public bookingController = new BookingController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/passenger`, authMiddleware, this.bookingController.createBookingPassenger);
        this.router.post(`${this.path}/flight`, authMiddleware, this.bookingController.createBookingFlight);
        this.router.get(`${this.path}/history`, authMiddleware, this.bookingController.getPassengerBookingHistory);
        this.router.get(`${this.path}/:booking_id`, authMiddleware, this.bookingController.getBookingInfo);

        this.router.patch(`${this.path}/:booking_id`, authMiddleware, this.bookingController.cancelBooking);
    }
}

export default BookingRoute;