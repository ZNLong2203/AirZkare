import { z } from 'zod';

export const BookingSchema= z.object({
  booking_id: z.string().uuid(), 
  user_id: z.string().uuid(), 
  status: z.enum(['pending', 'confirmed', 'cancelled']), 
  time: z.date(), 
});

export type Booking = z.infer<typeof BookingSchema>;
