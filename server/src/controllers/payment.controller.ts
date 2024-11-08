import { Request, Response, NextFunction } from "express";
import { Payment } from "../interfaces/payment.interface";
import PaymentService from "../services/payment.service";
import { config } from "../configs/zalopay.config";
import axios from 'axios';

class PaymentController {
    public paymentService = new PaymentService();

    public createPaymentStripe = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = req.user as any;
            const paymentData: Payment = req.body;

            const paymentSession = await this.paymentService.createPaymentStripe(userData, paymentData);

            res.status(201).json({
                message: 'Payment session created',
                metadata: paymentSession,
            });
        } catch(err) {
            next(err);
        }
    }

    public successPaymentStripe = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = req.user as any;
            const user_id = userData.user_id;
            const session_id = req.query.session_id as string;
            const paymentData = req.body;

            const paymentSession = await this.paymentService.successPaymentStripe(user_id, session_id, paymentData);

            res.status(200).json({
                message: 'Payment successful',
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

            const endpoint = config.endpoint || '';
            const response = await axios.post(endpoint, null, { params: paymentSession });
            res.status(201).json({
                message: 'Payment session created',
                metadata: response.data,
            });
        } catch(err) {
            next(err);
        }
    }

    public successPaymentZalopay = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = req.user as any;
            const user_id = userData.user_id;
            const session_id = req.query.session_id as string;
            const paymentData = req.body;

            const paymentSession = await this.paymentService.successPaymentZalopay(user_id, session_id, paymentData);

            res.status(200).json({
                message: 'Payment successful',
                metadata: paymentSession,
            });
        } catch(err) {
            next(err);
        }
    }
}

export default PaymentController;