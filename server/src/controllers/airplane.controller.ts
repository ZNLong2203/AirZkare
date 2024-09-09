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
}

export default AirplaneController;