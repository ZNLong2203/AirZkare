import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import AuthController from '../controllers/auth.controller';
import authMiddleware from '../middlewares/auth.middleware';

class AuthRoute implements Routes {
    public path = '/auth';
    public router = Router();   
    public authController = new AuthController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, this.authController.register);
        this.router.post(`${this.path}/login`, this.authController.login);
        this.router.post(`${this.path}/logout`, authMiddleware, this.authController.logout);
        this.router.post(`${this.path}/refresh-token`, this.authController.refreshToken);

        this.router.get(`${this.path}/google`, this.authController.googleAuth);
        this.router.get(`${this.path}/google/callback`, this.authController.googleAuthCallback);
    }
}

export default AuthRoute;