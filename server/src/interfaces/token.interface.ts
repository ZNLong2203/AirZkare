import { z } from 'zod';

export const TokenSchema = z.object({
    token_id: z.string().uuid(),
    user_id: z.string().uuid(),
    token: z.string(),
})

export type Token = z.infer<typeof TokenSchema>;