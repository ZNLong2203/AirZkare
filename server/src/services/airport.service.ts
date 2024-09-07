import { PrismaClientInstance } from "../db/PrismaClient";
import { HttpException } from "../exceptions/HttpException";
import { Airport } from "../interfaces/airport.interface";

const prisma = PrismaClientInstance();

class AirportService {
    public async createAirport(airportData: Airport): Promise<object> {
        if(!airportData) throw new HttpException(400, 'No data');

        const createAirport = await prisma.airport.create({
            data: {
                ...airportData,
            }
        })

        return createAirport;
    }

    public async getAllAirport(): Promise<object[]> {
        const findAllAirport = await prisma.airport.findMany();

        return findAllAirport;
    }

    public async editAirport(airport_id: string, airportData: Airport): Promise<object> {
        if(!airport_id || !airportData) throw new HttpException(400, 'No data');

        const editAirport = await prisma.airport.update({
            where: {
                airport_id: airport_id,
            },
            data: {
                ...airportData,
            }
        })
        if(!editAirport) throw new HttpException(404, 'Airport not found');

        return editAirport;
    }

    public async deleteAirport(airport_id: string): Promise<void> {
        if(!airport_id) throw new HttpException(400, 'No data');

        const deleteAirport = await prisma.airport.delete({
            where: {
                airport_id: airport_id,
            }
        })
        if(!deleteAirport) throw new HttpException(404, 'Airport not found');

        return;
    }
}

export default AirportService;