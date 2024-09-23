import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import authMiddleware from "../middlewares/auth.middleware";
import FlightController from "../controllers/flight.controller";

class FlightRoute implements Routes {
    public path = '/flight';
    public router = Router();
    public flightController = new FlightController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}`, authMiddleware, this.flightController.createFlight);
        this.router.get(`${this.path}/:flight_id`, authMiddleware, this.flightController.getFlightInfo);
        this.router.get(`${this.path}`, authMiddleware, this.flightController.getAllFlight);
        this.router.put(`${this.path}/:flight_id`, authMiddleware, this.flightController.updateFlight);
        this.router.delete(`${this.path}/:flight_id`, authMiddleware, this.flightController.deleteFlight);
    }
}

export default FlightRoute;
