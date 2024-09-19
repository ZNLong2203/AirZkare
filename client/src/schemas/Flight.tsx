import { z } from 'zod';

export const FlightSchema = z.object({
    flight_id: z.string().uuid(),
    code: z.string(),
    type: z.enum(['non-stop', 'connecting']),
    price_business: z.number().positive(),
    price_economy: z.number().positive(),
    departure_airport: z.string(),
    arrival_airport: z.string(),
    departure_time: z.date(),
    arrival_time: z.date(),
    status: z.enum(['on-time', 'delayed', 'cancelled']),
});

export type Flight = z.infer<typeof FlightSchema>;