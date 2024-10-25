import { z } from 'zod';

export const BookingPassenger = z.object({
    booking_passenger_id: z.string().uuid(),
    passenger_id: z.string().uuid(),
    booking_id: z.string().uuid(),
});
export type BookingPassenger = z.infer<typeof BookingPassenger>;