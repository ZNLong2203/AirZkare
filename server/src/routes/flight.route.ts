import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import FlightController from "../controllers/flight.controller";

class FlightRoute implements Routes {
    public path = '/flight';
    public router = Router();
    public flightController = new FlightController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}`, this.flightController.createFlight);
        this.router.get(`${this.path}`, this.flightController.getAllFlight);
        this.router.delete(`${this.path}/:flight_id`, this.flightController.deleteFlight);
    }
}

export default FlightRoute;
