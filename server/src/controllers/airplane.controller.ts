import { Request, Response, NextFunction } from 'express';
import { Airplane } from "../interfaces/airplane.interface";
import AirplaneService from "../services/airplane.service";

class AirplaneController {
    public AirplaneService = new AirplaneService();

    public createAirplane = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const airplaneData: Airplane = req.body;

            const createdAirplane = await this.AirplaneService.createAirplane(airplaneData);
            
            res.status(201).json({ 
                message: "Airplane successfully created",
                metadata: createdAirplane
            });
        } catch(err) {
            next(err);
        }
    }

    public getAllAirplane = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page } = req.query;
            const pageNumber = parseInt(page as string) || 1; 

            const airplanes = await this.AirplaneService.getAllAirplane(pageNumber);

            res.status(200).json({
                message: "Successfully retrieved airplanes",
                metadata: airplanes
            })
        } catch(err) {
            next(err);
        }
    }

    public getAirplaneInfo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { airplane_id } = req.params;

            const airplane = await this.AirplaneService.getAirplaneInfo(airplane_id);

            res.status(200).json({
                message: "Successfully retrieved airplane",
                metadata: airplane
            })
        } catch(err) {
            next(err);
        }
    }

    public updateAirplane = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { airplane_id } = req.params;
            const airplaneData: Airplane = req.body;

            const updatedAirplane = await this.AirplaneService.updateAirplane(airplane_id, airplaneData);

            res.status(200).json({
                message: "Airplane successfully updated",
                metadata: updatedAirplane
            })
        } catch(err) {
            next(err);
        }
    }

    public deleteAirplane = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { airplane_id } = req.params;

            await this.AirplaneService.deleteAirplane(airplane_id);

            res.status(200).json({
                message: "Airplane successfully deleted"
            })
        } catch(err) {
            next(err);
        }
    }
}

export default AirplaneController;