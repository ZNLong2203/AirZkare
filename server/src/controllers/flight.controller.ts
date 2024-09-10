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
            const flights = await this.flightService.getAllFlight();

            res.status(200).json({
                message: 'Flights fetched successfully',
                metadata: flights,
            })
        } catch(err) {
            next(err);
        }
    }
}

export default FlightController;