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
    }
}

export default FlightRoute;
