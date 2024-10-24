import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import authMiddleware from "../middlewares/auth.middleware";
import DashboardController from "../controllers/dashboard.controller";
import { initialize } from "passport";

class DashboardRoute implements Routes {
    public path = '/dashboard';
    public router = Router();
    public dashboardController = new DashboardController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/piechart`, authMiddleware, this.dashboardController.getPieChartData);
    }
}

export default DashboardRoute;