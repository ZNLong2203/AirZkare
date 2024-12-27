import { NextFunction, Request, Response } from "express";
import { User } from "../interfaces/user.interface";
import { Login } from "../interfaces/auth.interface";
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
            const data: Login = await this.authService.login(userData);

            res.cookie('refreshToken', data.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000,
            })
            res.cookie('user_id', data.user_id, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000,
            })
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
            await this.authService.logout(userData);

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: false,
                sameSite: 'lax'
            });
            res.clearCookie('user_id', {
                httpOnly: true,
                secure: false,
                sameSite: 'lax'
            });
            
            res.status(200).json({
                message: 'Logout successful',
            })
        } catch(err) {  
            next(err);
        }
    }

    public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refreshToken;
    
            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token is missing' });
            }
    
            const accessToken = await this.authService.refreshToken(refreshToken);
        
            return res.status(200).json({ accessToken });
        } catch (err) {
            console.error('[ERROR] Refresh Token Failed:', err);
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
                    res.cookie('refreshToken', user.refreshToken, {
                        httpOnly: true,
                        secure: false,
                        sameSite: 'lax',
                        maxAge: 24 * 7 * 60 * 60 * 1000, 
                    })
                    res.cookie('user_id', user.user_id, {
                        httpOnly: true,
                        secure: false,
                        sameSite: 'lax',
                        maxAge: 24 * 60 * 60 * 1000,
                    })
                    res.redirect(`${process.env.FRONTEND_URL}/?token=${encodeURIComponent(user.accessToken)}&user_id=${user.user_id}&role=${user.role}&expire=${Date.now() + 24 * 60 * 60 * 1000}`);
                });
            })(req, res, next);
        } catch(err) {
            next(err);
        }
    }
}

export default AuthController;