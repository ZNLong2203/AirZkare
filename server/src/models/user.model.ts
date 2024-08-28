import { UUID } from "crypto";

export interface user {
    id: string;
    username: string;
    password: string;
    name: string;
    age: number;
    email: string;
    passport: string;
    membership: string;
}