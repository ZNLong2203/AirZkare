import { z } from 'zod';

export const PaymentSchema = z.object({
  payment_id: z.string().uuid(),
  booking_id: z.string().uuid(),
  method: z.string(),
  amount: z.number().positive(),
  time: z.date(),
});

export type Payment = z.infer<typeof PaymentSchema>;
