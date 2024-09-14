import { z } from 'zod';

export const SeatSchema = z.object({
  seat_id: z.string().uuid(),
  airplane_id: z.string().uuid(),
  number: z.string(),
  class: z.enum(['economy', 'business']),
  status: z.enum(['available', 'booked', 'maintenance']),
});

export type Seat = z.infer<typeof SeatSchema>;
