import { z } from 'zod';

export const FlightSchema = z.object({
  flight_id: z.string().uuid(), 
  airplane_id: z.string().uuid(), 
  code: z.string(),
  type: z.enum(['non-stop', 'connecting']),
  status: z.enum(['on-time', 'delayed', 'cancelled', 'done']),
  price_business: z.number().positive(),
  price_economy: z.number().positive(), 
  departure_airport: z.string(), 
  arrival_airport: z.string(),
  departure_time: z.date(),
  arrival_time: z.date(), 
});
export type Flight = z.infer<typeof FlightSchema>;
