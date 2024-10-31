import { PrismaClientInstance } from "../db/PrismaClient";
import { HttpException } from "../exceptions/HttpException";
import moment from "moment";
import CryptoJS from 'crypto-js';
import { randomUUID, UUID } from "crypto";
import { Payment } from "../interfaces/payment.interface";
import { Stripe } from 'stripe';
import stripe from "../configs/stripe.config";
import { config } from "../configs/zalopay.config";

const prisma = PrismaClientInstance();

class PaymentService {
    public async createPaymentStripe(user_id: string, paymentData: Payment): Promise<object> {
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

    public async createPaymentZalopay(user_id: string, paymentData: Payment): Promise<object> {
        if(!user_id || !paymentData) throw new HttpException(400, 'No data');

        // await prisma.payment.create({
        //     data: {
        //         payment_id: randomUUID(),
        //         booking_id: paymentData.booking_id,
        //         method: 'zalopay',
        //         amount: paymentData.amount,
        //     }
        // })

        const embed_data = {
            redirecturl: 'http://localhost:3000',
        };
        const items: any[] = [{}]
        const transID = Math.floor(Math.random() * 1000000);
        const timestamp = Date.now();
        const order = {
            app_id: config.app_id,
            app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
            app_user: user_id, 
            app_time: timestamp,
            amount: paymentData.amount, 
            description: "Payment for airline booking",
            bank_code: 'zalopayapp', 
            item: JSON.stringify(items),
            embed_data: JSON.stringify(embed_data),
            order_id: paymentData.payment_id,
            // callback_url: 'https://yourdomain.com/payment-callback',
            mac: '',
        };
      
        // Concatenate required fields for MAC generation
        const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
        order.mac = CryptoJS.HmacSHA256(data, config.key1 || '').toString();
      
        return order;
    }
}

export default PaymentService;
