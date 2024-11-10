import { z } from 'zod';

export const SeatSchema = z.object({
    seat_id: z.string().uuid(),
    airplane_id: z.string().uuid(),
    number: z.string(),
    class: z.enum(['economy', 'business']),
});

export type Seat = z.infer<typeof SeatSchema>;