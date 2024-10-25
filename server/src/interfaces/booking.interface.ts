import { z } from 'zod';

export const BookingSchema= z.object({
  booking_id: z.string().uuid(), 
  user_id: z.string().uuid(), 
  type: z.enum(['oneWay', 'roundTrip']),
  status: z.enum(['pending', 'confirmed', 'cancelled']), 
  time: z.date(), 
});
export type Booking = z.infer<typeof BookingSchema>;

export const BookingFlightInfoSchema= z.object({
  flight_come_id: z.string().uuid(),
  flight_return_id: z.string().uuid(),
  seat_come_id: z.string().uuid(),
  seat_return_id: z.string().uuid(),
  flight_type: z.enum(['oneWay', 'roundTrip']),
});
export type BookingFlightInfo = z.infer<typeof BookingFlightInfoSchema>;
