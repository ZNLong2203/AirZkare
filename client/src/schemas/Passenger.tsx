import { z } from 'zod'

export const PassengerSchema = z.object({
    user_id: z.string().uuid(),
    username: z.string(),
    email: z.string(),
    role: z.string(),
    phone: z.string(),
    age: z.number().positive(),
    gender: z.string(),
    city: z.string(),
    country: z.string(),
    nationality: z.string(),
    membership: z.string(),
    dob: z.string(),
    passport: z.string(),
})

export type Passenger = z.infer<typeof PassengerSchema>;