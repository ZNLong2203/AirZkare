import { Request, Response, NextFunction } from "express";
import { Flight } from "../interfaces/flight.interface";
import FlightService from "../services/flight.service";

class FlightController {
    private flightService = new FlightService();

    public createFlight = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const flightData: Flight = req.body;

            const createFlight = await this.flightService.createFlight(flightData);

            res.status(201).json({
                message: 'Flight created successfully',
                metadata: createFlight,
            })
        } catch(err) {
            next(err);
        }
    }

    public getAllFlight = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page } = req.query;
            const pageNumber = parseInt(page as string) | 1;

            const flights = await this.flightService.getAllFlight(pageNumber);

            res.status(200).json({
                message: 'Flights fetched successfully',
                metadata: flights,
            })
        } catch(err) {
            next(err);
        }
    }

    public deleteFlight = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { flight_id } = req.params;

            await this.flightService.deleteFlight(flight_id);
            
            res.status(200).json({
                message: 'Flight deleted successfully',
            })
        } catch(err) {
            next(err);
        }
    }
}

export default FlightController;