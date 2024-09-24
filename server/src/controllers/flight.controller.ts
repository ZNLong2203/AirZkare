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
            const { page, departure_airport, arrival_airport, departure_time, arrival_time } = req.query;

            const pageNumber = parseInt(page as string) || 1;
            const departureAirportStr = departure_airport as string || '';
            const arrivalAirportStr = arrival_airport as string || '';
            let departureTimeDate: Date | undefined; 
            let arrivalTimeDate: Date | undefined;

            const convertToUTC = (dateString: string): Date | null => {
                const localDate = new Date(dateString);
                if (isNaN(localDate.getTime())) {
                    return null;
                }
                return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
            };
    
            if (departure_time && typeof departure_time === 'string') {
                const parsedDepartureTime = convertToUTC(departure_time);
                if (parsedDepartureTime) {
                    departureTimeDate = parsedDepartureTime;
                } else {
                    return res.status(400).json({ message: 'Departure date time type not valid' });
                }
            }
    
            if (arrival_time && typeof arrival_time === 'string') {
                const parsedArrivalTime = convertToUTC(arrival_time);
                if (parsedArrivalTime) {
                    arrivalTimeDate = parsedArrivalTime;
                } else {
                    return res.status(400).json({ message: 'Arrival date time type not valid' });
                }
            }

            const flights = await this.flightService.getAllFlight(pageNumber, departureAirportStr, arrivalAirportStr, departureTimeDate, arrivalTimeDate);

            res.status(200).json({
                message: 'Flights fetched successfully',
                metadata: flights,
            })
        } catch(err) {
            next(err);
        }
    }

    public getFlightInfo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { flight_id } = req.params;

            const flight = await this.flightService.getFlightInfo(flight_id);

            res.status(200).json({
                message: 'Flight fetched successfully',
                metadata: flight,
            })
        } catch(err) {
            next(err);
        }
    }

    public updateFlight = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { flight_id } = req.params;
            const flightData: Flight = req.body;

            const flights = await this.flightService.updateFlight(flight_id, flightData);

            res.status(200).json({
                message: 'Flight updated successfully',
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