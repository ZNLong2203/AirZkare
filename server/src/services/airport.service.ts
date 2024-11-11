import { PrismaClientInstance } from "../db/PrismaClient";
import { HttpException } from "../exceptions/HttpException";
import { Airport } from "../interfaces/airport.interface";
import { randomUUID } from "crypto";
import redisClient from "../configs/redis.config";

const prisma = PrismaClientInstance();

class AirportService {
    private async getCacheVersion(): Promise<number> {
        const version = await redisClient.get('airport:cacheVersion');
        return version ? parseInt(version) : 1;
    }

    private async incrementCacheVersion(): Promise<void> {
        await redisClient.incr('airport:cacheVersion');
    }

    public async createAirport(airportData: Airport): Promise<object> {
        if (!airportData) throw new HttpException(400, 'No data');

        const existsAirport = await prisma.airport.findFirst({
            where: {
                code: airportData.code
            }
        });
        if (existsAirport) throw new HttpException(409, 'Airport code already exists');

        const createdAirport = await prisma.airport.create({
            data: {
                ...airportData,
                airport_id: randomUUID(),
            }
        });

        await this.incrementCacheVersion();

        return createdAirport;
    }

    public async getAllAirport(page: number): Promise<object> {
        const version = await this.getCacheVersion();
        const redisKey = `airport:all:v${version}:${page}`;
        const cache = await redisClient.get(redisKey);
        if (cache) return JSON.parse(cache);

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
        };

        await redisClient.set(redisKey, JSON.stringify(metadata), { EX: 60 * 5 });

        return metadata;
    }

    public async getAirportInfo(airport_id: string): Promise<object> {
        const redisKey = `airport:${airport_id}`;
        const cache = await redisClient.get(redisKey);
        if (cache) return JSON.parse(cache);

        const airport = await prisma.airport.findUnique({
            where: {
                airport_id: airport_id,
            }
        });
        if (!airport) throw new HttpException(404, 'Airport not found');

        await redisClient.set(redisKey, JSON.stringify(airport), { EX: 60 * 5 });

        return airport;
    }

    public async editAirport(airport_id: string, airportData: Airport): Promise<object> {
        if (!airport_id || !airportData) throw new HttpException(400, 'No data');

        const existsAirport = await prisma.airport.findUnique({
            where: {
                airport_id: airport_id,
            }
        });
        if (!existsAirport) throw new HttpException(404, 'Airport not found');

        const updatedAirport = await prisma.airport.update({
            where: {
                airport_id: airport_id,
            },
            data: {
                ...airportData,
            }
        });

        await redisClient.del(`airport:${airport_id}`);
        await this.incrementCacheVersion();

        return updatedAirport;
    }

    public async deleteAirport(airport_id: string): Promise<void> {
        if (!airport_id) throw new HttpException(400, 'No data');

        const existsAirport = await prisma.airport.findUnique({
            where: {
                airport_id: airport_id,
            }
        });
        if (!existsAirport) throw new HttpException(404, 'Airport not found');

        await prisma.airport.delete({
            where: {
                airport_id: airport_id,
            }
        });

        await redisClient.del(`airport:${airport_id}`);
        await this.incrementCacheVersion();

        return;
    }
}

export default AirportService;
