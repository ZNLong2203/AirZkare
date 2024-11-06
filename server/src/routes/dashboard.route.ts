import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import authMiddleware from "../middlewares/auth.middleware";
import DashboardController from "../controllers/dashboard.controller";

class DashboardRoute implements Routes {
    public path = '/dashboard';
    public router = Router();
    public dashboardController = new DashboardController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/piechart`, authMiddleware, this.dashboardController.getPieChartData);
        this.router.get(`${this.path}/linechart`, authMiddleware, this.dashboardController.getLineChartData);
    }
}

export default DashboardRoute;