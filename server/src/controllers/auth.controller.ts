import { NextFunction, Request, Response } from "express";
import { User } from "../interfaces/user.interface";
import { Token } from "../interfaces/token.interface";
import AuthService from "../services/auth.service";

class AuthController {
    public authService = new AuthService();

    public register = async  (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: User = req.body;
            const signUpUserData: User = await this.authService.register(userData);

            res.status(201).json({
                message: 'User registered successfully',
                data: signUpUserData,
            })
        } catch(err) {
            next(err);
        }
    }

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: User = req.body
            const { token }: Token = await this.authService.login(userData);

            res.status(200).json({ 
                message: 'Login successful',
                data:  token ,
            });
        } catch(err) {
            next(err);
        }
    }
}

export default AuthController;