export interface Booking {
    booking_id: string;
    user_id: string;
    flight_seat_id: string;
    price: number;
    time: Date;
    status: 'pending' | 'confirmed' | 'cancelled'; 
}
