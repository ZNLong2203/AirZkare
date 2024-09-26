import { z } from 'zod';

export const BookingFlightSchema = z.object({
    booking_flight_id: z.string().uuid(),
    booking_id: z.string().uuid(),
    flight_seat_id: z.string().uuid(),
    flight_type: z.enum(['outbound', 'inbound']),
});

export type BookingFlight = z.infer<typeof BookingFlightSchema>;