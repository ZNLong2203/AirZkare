import { z } from 'zod';

export const BookingSchema= z.object({
  booking_id: z.string().uuid(), 
  user_id: z.string().uuid(), 
  flight_seat_id: z.string().uuid(), 
  price: z.number().positive(),
  time: z.date(), 
  status: z.enum(['pending', 'confirmed', 'cancelled']), 
});

export type Booking = z.infer<typeof BookingSchema>;
