import { z } from 'zod';

export const UserSchema = z.object({
  user_id: z.string().uuid(),
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  image: z.string().nullable(),
  provider: z.string().nullable(),
  provider_code: z.string().nullable(),
  role: z.enum(['user', 'admin']).nullable(),
});

export type User = z.infer<typeof UserSchema>;
