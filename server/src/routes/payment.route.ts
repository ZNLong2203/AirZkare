import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import authMiddleware from "../middlewares/auth.middleware";
import PaymentController from "../controllers/payment.controller";

class PaymentRoute implements Routes {
    public path = '/payment';
    public router = Router();
    public paymentController = new PaymentController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/stripe`, authMiddleware, this.paymentController.createPaymentStripe);
        this.router.post(`${this.path}/zalopay`, authMiddleware, this.paymentController.createPaymentZalopay);
    }
}

export default PaymentRoute;
