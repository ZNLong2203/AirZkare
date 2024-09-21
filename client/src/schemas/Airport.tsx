import { z } from "zod";

export const AirportSchema = z.object({
    airport_id: z.string().uuid(),
    code: z.string(),
    name: z.string(),
    location: z.string(),
});

export type Airport = z.infer<typeof AirportSchema>;

export const AirportSchemaWithoutId = z.object({
    code: z.string(),
    name: z.string(),
    location: z.string(),
});

export type AirportWithoutId = z.infer<typeof AirportSchemaWithoutId>;

