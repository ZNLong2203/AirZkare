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
            const airplanes = await this.AirplaneService.getAllAirplane();

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
            const airplane_id: string = req.params.id;

            const airplane = await this.AirplaneService.getAllAirplane(airplane_id);

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
            const airplane_id: string = req.params.id;
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
            const airplane_id: string = req.params.id;

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