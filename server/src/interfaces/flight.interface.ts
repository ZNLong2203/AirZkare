import { z } from 'zod';

export const FlightSchema = z.object({
  flight_id: z.string().uuid(), 
  airplane_id: z.string().uuid(), 
  code: z.string(), 
  departure_airport: z.string(), 
  arrival_airport: z.string(),
  departure_time: z.date(),
  arrival_time: z.date(), 
});

export type Flight = z.infer<typeof FlightSchema>;
