import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';
import PassengerController from '../controllers/passenger.controller';

class PassengerRoute implements Routes {
    public path = '/passenger';
    public router = Router();
    public passengerController = new PassengerController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/:user_id`, authMiddleware, this.passengerController.getPassengerInfo);
        this.router.get(`${this.path}`, authMiddleware, this.passengerController.getAllPassenger);
        this.router.patch(`${this.path}/:user_id`, authMiddleware, this.passengerController.updatePassenger);
        this.router.delete(`${this.path}/:user_id`, authMiddleware, this.passengerController.deletePassenger);
    }
}

export default PassengerRoute;
