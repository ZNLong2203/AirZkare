import { NextFunction, Request, Response } from "express";
import { User } from "../interfaces/user.interface";
import passport from "../configs/googleAuth.config";
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
            const { data } = await this.authService.login(userData);

            res.status(200).json({ 
                message: 'Login successful',
                metadata:  {
                    ...data,
                    expire: Date.now() + 24 * 60 * 60 * 1000,
                }
            });
        } catch(err) {
            next(err);
        }
    }

    public logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: User = req.user as User;
            console.log(userData);
            await this.authService.logout(userData);

            res.clearCookie('token');
            res.status(200).json({
                message: 'Logout successful',
            })
        } catch(err) {  
            next(err);
        }
    }

    // Google Auth
    public googleAuth = async (req: Request, res: Response, next: NextFunction) => {
        try {
            passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
        } catch(err) {
            next(err);
        }
    }

    public googleAuthCallback = async (req: Request, res: Response, next: NextFunction) => {
        try {
            passport.authenticate('google', (err: any, user: any) => {
                if(err) {
                    return next(err);
                }
                if(!user) {
                    return res.redirect('/login');
                }
                req.logIn(user, (err: any) => {
                    if(err) {
                        return next(err);
                    }
                    res.cookie('token', user.token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
                    res.cookie('user_id', user.user_id, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
                    res.redirect(`${process.env.FRONTEND_URL}/?token=${encodeURIComponent(user.token)}`);
                });
            })(req, res, next);
        } catch(err) {
            next(err);
        }
    }
}

export default AuthController;