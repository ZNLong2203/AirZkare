import { Request, Response, NextFunction } from 'express';
import DashboardService from '../services/dashboard.service';

class DashboardController {
    public dashboardService = new DashboardService();

    public getPieChartData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pieChartData = await this.dashboardService.getPieChartData();

            res.status(200).json({
                message: 'Pie chart data fetched successfully',
                metadata: pieChartData,
            })
        } catch(err) {
            next(err);
        }
    }
}

export default DashboardController;