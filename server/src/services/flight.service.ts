import { PrismaClientInstance } from "../db/PrismaClient";
import { HttpException } from "../exceptions/HttpException";
import { Flight } from "../interfaces/flight.interface";
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

    public async getAllFlight(page: number): Promise<object> {
        const limit = 10;
        const skip = (page - 1) * limit;

        const totalFlight = await prisma.flight.count();
        const flights = await prisma.flight.findMany({
            skip: skip,
            take: limit
        });

        const totalPages = Math.ceil(totalFlight / limit);
        const metadata = {
            flights: flights,
            totalPages: totalPages,
            currentPage: page
        }

        return metadata;
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