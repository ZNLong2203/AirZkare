import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import AirportController from '../controllers/airport.controller';

class AirportRoute implements Routes {
    public path = '/airport';
    public router = Router();
    public airportController = new AirportController();

    constructor() {
        this.router.post(`${this.path}`, this.airportController.createAirport);
        this.router.get(`${this.path}`, this.airportController.getAllAirport);
        this.router.patch(`${this.path}/:airport_id`, this.airportController.editAirport);
        this.router.delete(`${this.path}/:airport_id`, this.airportController.deleteAirport);
    }
}

export default AirportRoute;
