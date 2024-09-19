import { z } from "zod";

export const AirportSchema = z.object({
    airport_id: z.string(),
    code: z.string(),
    name: z.string(),
    location: z.string(),
});

export type Airport = z.infer<typeof AirportSchema>;
