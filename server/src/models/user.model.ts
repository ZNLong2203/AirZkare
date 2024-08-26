import { UUID } from "crypto";

export interface User {
    id: UUID;
    username: string;
    password: string;
    name: string;
    age: number;
    email: string;
    passport: string;
    member_ship: string;
}