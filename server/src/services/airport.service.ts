import { PrismaClientInstance } from "../db/PrismaClient";
import { HttpException } from "../exceptions/HttpException";
import { Airport } from "../interfaces/airport.interface";
import { randomUUID } from "crypto";

const prisma = PrismaClientInstance();

class AirportService {
    public async createAirport(airportData: Airport): Promise<object> {
        if(!airportData) throw new HttpException(400, 'No data');

        const existsAirport = await prisma.airport.findFirst({
            where: {
                code: airportData.code
            }
        })
        if(existsAirport) throw new HttpException(401, 'Airport code it exists')

        const createAirport = await prisma.airport.create({
            data: {
                ...airportData,
                airport_id: randomUUID(),
            }
        })

        return createAirport;
    }

    public async getAllAirport(page: number): Promise<object> {
        const limit = 10;
        const skip = (page - 1) * limit;

        const totalAirport = await prisma.airport.count();
        const findAllAirport = await prisma.airport.findMany({
            skip: skip,
            take: limit
        });

        const totalPages = Math.ceil(totalAirport / limit);
        const metadata = {
            airports: findAllAirport,
            totalPages: totalPages,
            currentPage: page
        }

        return metadata;
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