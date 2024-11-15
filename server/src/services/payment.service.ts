import { PrismaClientInstance } from "../db/PrismaClient";
import { HttpException } from "../exceptions/HttpException";
import moment from "moment";
import CryptoJS from 'crypto-js';
import { randomUUID, UUID } from "crypto";
import { Payment } from "../interfaces/payment.interface";
import { User } from "../interfaces/user.interface";
import { sendEmail } from "../configs/nodeMailer.config";
import { Stripe } from 'stripe';
import stripe from "../configs/stripe.config";
import { config } from "../configs/zalopay.config";

const prisma = PrismaClientInstance();

class PaymentService {
    public async createPaymentStripe(userData: User, paymentData: Payment): Promise<object> {
        if(!userData || !paymentData) throw new HttpException(400, 'No data');
        const sessionData: Stripe.Checkout.SessionCreateParams = {
            line_items: [
                {   
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Flight Booking',
                        },
                        unit_amount: paymentData.amount * 100,
                    },
                    quantity: 1,
                }
            ],
            customer_email: userData.email,
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&payment=stripe`,
            cancel_url: `${process.env.FRONTEND_URL}`
        }

        const session = await stripe.checkout.sessions.create(sessionData);

        return session;
    }

    public async successPaymentStripe(user_id: string, session_id: string, paymentData: any): Promise<object> {
        if(!session_id) throw new HttpException(400, 'No data');
    
        const findBooking = await prisma.booking.findFirst({
            where: {
                user_id: user_id,
                status: 'pending',
            }
        })
        if(!findBooking) throw new HttpException(404, 'No booking found');
    
        await prisma.booking.update({
            where: {
                booking_id: findBooking.booking_id,
            },
            data: {
                status: 'confirmed',
            }
        })
    
        const session = await stripe.checkout.sessions.retrieve(session_id.toString());
    
        await sendEmail({
            customer_email: session.customer_email!,
            customer_details: { 
                name: session.customer_details?.name ?? 'Unknown' 
            },
            id: session.id,
            flight_details: { 
                flight_come_number: paymentData.paymentData.flight_come?.code ?? 'N/A', 
                departure_come: paymentData.paymentData.departure_come_airport?.location ?? 'N/A', 
                destination_come: paymentData.paymentData.arrival_come_airport?.location ?? 'N/A', 
                date_come: paymentData.paymentData.departure_come_time ? moment(paymentData.paymentData.departure_come_time).format('YYYY-MM-DD') : 'N/A', 
                time_come: paymentData.paymentData.departure_come_time ? moment(paymentData.paymentData.departure_come_time).format('HH:mm') : 'N/A',
    
                flight_return_number: paymentData.paymentData.flight_return?.code ?? 'N/A',
                departure_return: paymentData.paymentData.departure_return_airport?.location ?? 'N/A',
                destination_return: paymentData.paymentData.arrival_return_airport?.location ?? 'N/A',
                date_return: paymentData.paymentData.departure_return_time ? moment(paymentData.paymentData.departure_return_time).format('YYYY-MM-DD') : 'N/A',
                time_return: paymentData.paymentData.departure_return_time ? moment(paymentData.paymentData.departure_return_time).format('HH:mm') : 'N/A',

                passengers: paymentData.paymentData.passengers ?? 'N/A',
                type: paymentData.paymentData.type ?? 'N/A',
            },
            amount_total: session.amount_total ?? 0,
        })
    
        await prisma.payment.create({
            data: {
                payment_id: randomUUID(),
                booking_id: findBooking.booking_id,
                method: 'credit_card',
                amount: session.amount_total ?? 0,
            }
        })
        return session;
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
            redirecturl: `${process.env.FRONTEND_URL}/payment/success?payment=zalopay`,
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

    public async successPaymentZalopay(user_id: string, session_id: string, paymentData: any): Promise<void> {
        if(!session_id) throw new HttpException(400, 'No data');

        const findBooking = await prisma.booking.findFirst({
            where: {
                user_id: user_id,
                status: 'pending',
            }
        })
        if(!findBooking) throw new HttpException(404, 'No booking found');

        await prisma.booking.update({
            where: {
                booking_id: findBooking.booking_id,
            },
            data: {
                status: 'confirmed',
            }
        })
    }
}

export default PaymentService;
