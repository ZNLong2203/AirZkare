import { z } from 'zod';
import { SeatSchema } from './Seat';

export const FlightSeatSchema = z.object({
    flight_seat_id: z.string().uuid(),
    flight_id: z.string().uuid(),
    passenger_id: z.string().uuid().nullable(),
    seat_id: z.string().uuid(),
    is_booked: z.boolean(),
    seat: SeatSchema,
})

export type FlightSeat = z.infer<typeof FlightSeatSchema>;