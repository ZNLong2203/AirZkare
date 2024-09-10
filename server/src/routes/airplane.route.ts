import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import AirplaneController from '../controllers/airplane.controller';

class AirplaneRoute implements Routes {
    public path = '/airplane';
    public router = Router();
    public airplaneController = new AirplaneController();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.post(`${this.path}`, this.airplaneController.createAirplane);
        this.router.get(`${this.path}/:airplane_id`, this.airplaneController.getAirplaneInfo);
        this.router.get(`${this.path}`, this.airplaneController.getAllAirplane);
        this.router.put(`${this.path}/:airplane_id`, this.airplaneController.updateAirplane);
        this.router.delete(`${this.path}/:airplane_id`, this.airplaneController.deleteAirplane);
    }
}

export default AirplaneRoute;