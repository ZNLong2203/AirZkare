import { PrismaClientInstance } from "../db/PrismaClient";
import { HttpException } from "../exceptions/HttpException";
import { Flight } from "../interfaces/flight.interface";
import { randomUUID } from "crypto";

const prisma = PrismaClientInstance();

class FlightService {
    public async createFlight(flightData: Flight): Promise<object> {
        if(!flightData) throw new HttpException(400, 'No data');

        const createFlight = await prisma.flight.create({
            data: {
                ...flightData,
                flight_id: randomUUID(),
            }
        })

        return createFlight;
    }
}

export default FlightService;