import { z } from 'zod';

export const FlightSeatSchema = z.object({
  flight_seat_id: z.string().uuid(), 
  flight_id: z.string().uuid(), 
  passenger_id: z.string().uuid(),
  seat_id: z.string().uuid(), 
  is_booked: z.boolean(),
  held_by: z.string().uuid().nullable(),
  held_at: z.string().nullable(),
  hold_expires: z.string().nullable(),
});
export type FlightSeat = z.infer<typeof FlightSeatSchema>;
