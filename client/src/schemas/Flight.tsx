import { z } from 'zod';
import { AirportSchema } from './Airport';
import { AirplaneSchema } from './Airplane';
import { FlightSeatSchema } from './FlightSeat';

const BaseFlightSchema = z.object({
  airplane_id: z.string().uuid(),
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

export const FlightSchema = BaseFlightSchema.extend({
  flight_id: z.string().uuid(),
});

export type Flight = z.infer<typeof FlightSchema>;

export const FlightSchemaWithDA = FlightSchema.extend({
  departure_airport: z.string().uuid(),
  arrival_airport: z.string().uuid(),
  airplane: AirplaneSchema,
  airport_flight_departure_airportToairport: AirportSchema,
  airport_flight_arrival_airportToairport: AirportSchema,
  availableEconomySeats: z.number().positive(),
  availableBusinessSeats: z.number().positive(),
  flight_seat: FlightSeatSchema.array(),
});

export type FlightWithDA = z.infer<typeof FlightSchemaWithDA>;

export const FlightSchemaWithoutId = BaseFlightSchema;

export type FlightWithoutId = z.infer<typeof FlightSchemaWithoutId>;
