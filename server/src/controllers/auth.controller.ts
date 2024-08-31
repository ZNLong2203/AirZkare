import { NextFunction, Request, Response } from "express";
import { User } from "../interfaces/user.interface";
import AuthService from "../services/auth.service";

class AuthController {
    public authService = new AuthService();

    public register = async  (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: User = req.body;
            await this.authService.register(userData);

            res.status(201).json({
                message: 'User registered successfully',
            })
        } catch(err) {
            next(err);
        }
    }

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: User = req.body
            const { token } = await this.authService.login(userData);

            res.status(200).json({ 
                message: 'Login successful',
                data:  {
                    token: token,
                    expire: Date.now() + 24 * 60 * 60 * 1000,
                }
            });
        } catch(err) {
            next(err);
        }
    }

    public logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: User = req.body;
            await this.authService.logout(userData);

            res.status(200).json({
                message: 'Logout successful',
            })
        } catch(err) {  
            next(err);
        }
    }
}

export default AuthController;