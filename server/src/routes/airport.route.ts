import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';
import AirportController from '../controllers/airport.controller';

class AirportRoute implements Routes {
    public path = '/airport';
    public router = Router();
    public airportController = new AirportController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}`, authMiddleware, this.airportController.createAirport);
        this.router.get(`${this.path}`, this.airportController.getAllAirport);
        this.router.patch(`${this.path}/:airport_id`, authMiddleware, this.airportController.editAirport);
        this.router.delete(`${this.path}/:airport_id`, authMiddleware, this.airportController.deleteAirport);
    }
}

export default AirportRoute;
