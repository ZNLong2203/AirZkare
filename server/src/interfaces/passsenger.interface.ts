export interface Passenger {
    passenger_id: string;
    user_id: string;
    age: number;
    gender: string;
    dob: Date;
    phone: string;
    city: string;
    country: string;
    nationality: string;
    passport: string;
    membership: 'silver' | 'gold' | 'platinum';
}