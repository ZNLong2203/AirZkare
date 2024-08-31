import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import PassengerController from '../controllers/passenger.interface';

class PassengerRoute implements Routes {
    public path = '/passenger';
    public router = Router();
    public passengerController = new PassengerController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/:user_id`, this.passengerController.getPassenger);
        this.router.get(`${this.path}`, this.passengerController.getAllPassenger);
    }
}

export default PassengerRoute;
