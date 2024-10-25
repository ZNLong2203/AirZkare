import { PrismaClientInstance } from "../db/PrismaClient";
import { HttpException } from "../exceptions/HttpException";
import { Flight } from "../interfaces/flight.interface";
import { Airplane } from "../interfaces/airplane.interface";
import { randomUUID } from "crypto";

const prisma = PrismaClientInstance();

class FlightService {
    public async createFlight(flightData: Flight): Promise<object> {
        if(!flightData) throw new HttpException(400, 'No data');

        const duplicateFlight = await prisma.flight.findMany({
            where: {
                airplane_id: flightData.airplane_id,
                status: {
                    in: ['on-time', 'delayed'],
                }
            }
        })

        duplicateFlight.forEach((flight) => {
            if(flightData.departure_time >= flight.departure_time! && flightData.departure_time <= flight.arrival_time!) {
                throw new HttpException(400, 'Airplane is already used');
            }
        })

        const createFlight = await prisma.flight.create({
            data: {
                ...flightData,
                flight_id: randomUUID(),
            }
        })

        return createFlight;
    }

    public async getAllFlight(page: number, departure_airport?: string, arrival_airport?: string, departure_time?: Date, arrival_time?: Date): Promise<object> {
        const limit = 10;
        const skip = (page - 1) * limit;
    
        const filters: any = {};
        if (departure_airport) filters.departure_airport = departure_airport;
        if (arrival_airport) filters.arrival_airport = arrival_airport;
        if (departure_time) filters.departure_time = { gte: departure_time };
        if (arrival_time) filters.arrival_time = { lte: arrival_time };
    
        const totalFlight = await prisma.flight.count({
            where: filters,
        });
    
        const flights = await prisma.flight.findMany({
            where: filters,
            skip: skip,
            take: limit,
            include: {
                airplane: true,
                airport_flight_departure_airportToairport: true,
                airport_flight_arrival_airportToairport: true,
                flight_seat: {
                    include: {
                        seat: true
                    }
                }
            }
        });
    
        const enrichedFlights = flights.map(flight => {
            const totalEconomySeats = flight.airplane.total_economy;
            const totalBusinessSeats = flight.airplane.total_business;
    
            // Count booked economy and business seats
            const bookedEconomySeats = flight.flight_seat.filter(
                seat => seat.seat.class?.toLowerCase() === 'economy' && seat.is_booked === true
            ).length;
    
            const bookedBusinessSeats = flight.flight_seat.filter(
                seat => seat.seat.class?.toLowerCase() === 'business' && seat.is_booked === true
            ).length;
    
            // Calculate available seats by subtracting the booked seats from the total seats
            const availableEconomySeats = totalEconomySeats - bookedEconomySeats;
            const availableBusinessSeats = totalBusinessSeats - bookedBusinessSeats;
    
            return {
                ...flight,
                availableEconomySeats: availableEconomySeats,
                availableBusinessSeats: availableBusinessSeats,
            };
        });
    
        // Calculate total pages for pagination
        const totalPages = Math.ceil(totalFlight / limit);
        const metadata = {
            flights: enrichedFlights,
            totalPages: totalPages,
            currentPage: page
        };
    
        return metadata;
    }
    
    

    public async getFlightInfo(flight_id: string): Promise<object> {
        if(!flight_id) throw new HttpException(400, 'No flight id');

        const flight = await prisma.flight.findUnique({
            where: {
                flight_id: flight_id,
            },
            include: {
                airport_flight_departure_airportToairport: true,
                airport_flight_arrival_airportToairport: true,
            }
        })

        if(!flight) throw new HttpException(404, `Flight with id ${flight_id} not found`);

        return flight;
    }

    public async updateFlight(flight_id: string, flightData: Flight): Promise<object> {
        if(!flight_id || !flightData) throw new HttpException(400, 'No data');

        const existsFlight = await prisma.flight.findUnique({
            where: {
                flight_id: flight_id,
            }
        })
        if(!existsFlight) throw new HttpException(404, `Flight with id ${flight_id} not found`);

        const checkAirplane = await prisma.flight.findMany({
            where: {
                airplane_id: flightData.airplane_id,
                status: {
                    in: ['on-time', 'delayed'],
                }
            }
        })
        checkAirplane.forEach((flight) => {
            if(flightData.departure_time >= flight.departure_time! && flightData.departure_time <= flight.arrival_time!) {
                throw new HttpException(400, 'Airplane is already used');
            }
        })

        const updatedFlight = await prisma.flight.update({
            where: {
                flight_id: flight_id,
            },
            data: flightData
        })

        return updatedFlight;
    }

    public async deleteFlight(flight_id: string): Promise<void> {
        if(!flight_id) throw new HttpException(400, 'No flight id');

        // Transaction to delete flight seat and flight
        await prisma.$transaction(async (prisma) => {
            try {
                await prisma.flight_seat.deleteMany({
                    where: {
                        flight_id: flight_id
                    }
                })
    
                await prisma.flight.delete({
                    where: {
                        flight_id: flight_id
                    }
                })
            } catch(err) {
                throw new HttpException(500, 'Transaction failed');
            }
        });

        return;
    }
}

export default FlightService;