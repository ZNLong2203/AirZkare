import { z } from 'zod';
import { AirportSchema } from './Airport';

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

export const FlightSchemaWithDA = z.object({
    flight_id: z.string().uuid(),
    code: z.string(),
    type: z.enum(['non-stop', 'connecting']),
    price_business: z.number().positive(),
    price_economy: z.number().positive(),
    departure_airport: z.string().uuid(),  
    arrival_airport: z.string().uuid(),    
    departure_time: z.date(),
    arrival_time: z.date(),
    status: z.enum(['on-time', 'delayed', 'cancelled']),
    airport_flight_departure_airportToairport: AirportSchema,  
    airport_flight_arrival_airportToairport: AirportSchema,    
});

export type FlightWithDA = z.infer<typeof FlightSchemaWithDA>;


export const FlightSchemaWithoutId = z.object({
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

export type FlightWithoutId = z.infer<typeof FlightSchemaWithoutId>;
