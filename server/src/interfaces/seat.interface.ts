export interface Seat {
    seat_id: string;
    airplane_id: string;
    number: string;
    class: 'economy' | 'business'; 
    status: 'available' | 'booked' | 'maintenance'; 
}
