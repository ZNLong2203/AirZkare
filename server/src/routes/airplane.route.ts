import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';
import AirplaneController from '../controllers/airplane.controller';

class AirplaneRoute implements Routes {
    public path = '/airplane';
    public router = Router();
    public airplaneController = new AirplaneController();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.post(`${this.path}`, authMiddleware, this.airplaneController.createAirplane);
        this.router.get(`${this.path}/:airplane_id`, authMiddleware, this.airplaneController.getAirplaneInfo);
        this.router.get(`${this.path}`, authMiddleware, this.airplaneController.getAllAirplane);
        this.router.put(`${this.path}/:airplane_id`, authMiddleware, this.airplaneController.updateAirplane);
        this.router.delete(`${this.path}/:airplane_id`, authMiddleware, this.airplaneController.deleteAirplane);
    }
}

export default AirplaneRoute;