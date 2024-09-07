import { Request, Response, NextFunction } from 'express';
import { Airport } from '../interfaces/airport.interface';
import AirportService from '../services/airport.service';

class AirportController {
    public airportService = new AirportService();

    public createAirport = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const airportData: Airport = req.body;
            
            const createAirport = await this.airportService.createAirport(airportData);

            res.status(201).json({
                message: 'Airport created successfully',
                metadata: createAirport,
            })
        } catch(err) {
            next(err);
        }
    }

    public getAllAirport = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const findAllAirport = await this.airportService.getAllAirport();

            res.status(200).json({
                message: 'Airport fetched successfully',
                metadata: findAllAirport,
            })
        } catch(err) {
            next(err);
        }
    }

    public editAirport = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { airport_id } = req.params;
            const airportData: Airport = req.body;

            const editAirport = await this.airportService.editAirport(airport_id, airportData);

            res.status(200).json({
                message: 'Airport updated successfully',
                metadata: editAirport,
            })
        } catch(err) {
            next(err);
        }
    }

    public deleteAirport = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { airport_id } = req.params;

            await this.airportService.deleteAirport(airport_id);

            res.status(200).json({
                message: 'Airport deleted successfully',
            })
        } catch(err) {
            next(err);
        }
    }
}

export default AirportController;