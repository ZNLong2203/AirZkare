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
        this.router.post(`${this.path}`, authMiddleware, this.bookingController.createBooking);
    }
}

export default BookingRoute;