import { z } from 'zod';

export const FlightSeatSchema = z.object({
  flight_seat_id: z.string().uuid(), 
  flight_id: z.string().uuid(), 
  seat_id: z.string().uuid(), 
});

export type FlightSeat = z.infer<typeof FlightSeatSchema>;
