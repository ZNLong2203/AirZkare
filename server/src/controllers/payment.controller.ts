import { Request, Response, NextFunction } from "express";
import { Payment } from "../interfaces/payment.interface";
import PaymentService from "../services/payment.service";

class PaymentController {
    public paymentService = new PaymentService();

    public createPaymentStripe = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = req.user as any;
            const user_id = userData.user_id;
            const paymentData: Payment = req.body;

            const paymentSession = await this.paymentService.createPaymentStripe(user_id, paymentData);

            res.status(201).json({
                message: 'Payment session created',
                metadata: paymentSession,
            });
        } catch(err) {
            next(err);
        }
    }

    public createPaymentZalopay = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = req.user as any;
            const user_id = userData.user_id;
            const paymentData: Payment = req.body;

            const paymentSession = await this.paymentService.createPaymentZalopay(user_id, paymentData);

            res.status(201).json({
                message: 'Payment session created',
                metadata: paymentSession,
            });
        } catch(err) {
            next(err);
        }
    }
}

export default PaymentController;