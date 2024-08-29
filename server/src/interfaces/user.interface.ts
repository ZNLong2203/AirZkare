import { UUID } from "crypto";

export interface User {
    user_id: string;
    username: string;
    password: string;
    name: string;
    email: string;
    provider: string;
    provider_code: string;
    role: string;
}