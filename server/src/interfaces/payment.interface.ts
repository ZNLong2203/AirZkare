export interface Payment {
    payment_id: string;
    booking_id: string;
    method: string;
    amount: number;
    time: Date;
}