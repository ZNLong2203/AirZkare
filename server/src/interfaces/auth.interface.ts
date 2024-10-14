import { z } from "zod";
import { Request } from "express";
import { User } from "./user.interface";

export const LoginSchema = z.object({
    user_id: z.string(),
    username: z.string(),
    email: z.string().email(),
    role: z.string(),
    token: z.string(),
})
export type Login = z.infer<typeof LoginSchema>;

export interface RequestWithUser extends Request {
    user?: User;
}
