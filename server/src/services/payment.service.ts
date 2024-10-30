import { PrismaClientInstance } from "../db/PrismaClient";
import { HttpException } from "../exceptions/HttpException";
import { randomUUID, UUID } from "crypto";
import { Payment } from "../interfaces/payment.interface";
import { Stripe } from 'stripe';
import stripe from "../configs/stripe.config";

const prisma = PrismaClientInstance();

class PaymentService {
    public async createPaymentSession(user_id: string, paymentData: Payment): Promise<object> {
        if(!user_id || !paymentData) throw new HttpException(400, 'No data');
        const sessionData: Stripe.Checkout.SessionCreateParams = {
            // line_items: cart_items.map(item => {
            //     return {
            //         price_data: {
            //             currency: 'usd',
            //             product_data: {
            //                 name: item.cart_product.product_name,
            //                 images: [item.cart_product.product_image || "https://applecenter.com.vn/uploads/cms/16632365177447.jpg"],
            //                 metadata: { 
            //                     product_id: item.cart_product._id.toString()
            //                 }
            //             },
            //             unit_amount: item.cart_product.product_price * 100
            //         },
            //         quantity: item.cart_quantity,
            //     }
            // }),
            // customer_email: user.email,
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/paymentsuccess?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}`
        }

        const session = await stripe.checkout.sessions.create(sessionData);

        const createPayment = await prisma.payment.create({
            data: {
                payment_id: randomUUID(),
                booking_id: paymentData.booking_id,
                method: 'credit_card',
                amount: paymentData.amount,
            }
        })

        return createPayment;
    }
}

export default PaymentService;
