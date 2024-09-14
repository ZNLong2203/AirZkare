import { z } from 'zod';

export const UserSchema = z.object({
  user_id: z.string().uuid(),
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  provider: z.string().nullable(),
  provider_code: z.string().nullable(),
  role: z.enum(['user', 'admin']).nullable(),
  image: z.string().nullable(),
});

export type User = z.infer<typeof UserSchema>;
