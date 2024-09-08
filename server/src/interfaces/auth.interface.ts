import { Request } from "express";
import { User } from "../interfaces/user.interface";

export interface RequestWithUser extends Request {
    user: User;
}
