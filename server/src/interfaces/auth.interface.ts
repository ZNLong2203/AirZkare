import { z } from "zod";

export const LoginSchema = z.object({
    user_id: z.string(),
    username: z.string(),
    email: z.string().email(),
    role: z.string(),
    token: z.string(),
})
export type Login = z.infer<typeof LoginSchema>;