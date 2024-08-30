import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import AuthController from '../controllers/auth.controller';

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
    }
}

export default AuthRoute;