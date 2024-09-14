import { z } from 'zod';

export const PassengerSchema = z.object({
  passenger_id: z.string().uuid(), 
  user_id: z.string().uuid(), 
  age: z.number().int().min(0), 
  gender: z.string(), 
  dob: z.date(), 
  phone: z.string(), 
  city: z.string(), 
  country: z.string(), 
  nationality: z.string(), 
  passport: z.string(), 
  membership: z.enum(['silver', 'gold', 'platinum']), 
});

export type Passenger = z.infer<typeof PassengerSchema>;
