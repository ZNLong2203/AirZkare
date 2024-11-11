import { PrismaClientInstance } from "../db/PrismaClient";
import { HttpException } from "../exceptions/HttpException";
import { Airplane } from "../interfaces/airplane.interface";
import { randomUUID } from "crypto";
import redisClient from "../configs/redis.config";

const prisma = PrismaClientInstance();

class AirplaneService {
    private async getCacheVersion(): Promise<number> {
        const version = await redisClient.get('airplane:cacheVersion');
        return version ? parseInt(version) : 1;
    }

    private async incrementCacheVersion(): Promise<void> {
        await redisClient.incr('airplane:cacheVersion');
    }

    public async createAirplane(airplaneData: Airplane): Promise<object> {
        if (!airplaneData) throw new HttpException(400, 'No data');

        const existsAirplane = await prisma.airplane.findFirst({
            where: {
                name: airplaneData.name
            }
        });
        if (existsAirplane) throw new HttpException(409, `Airplane with name ${airplaneData.name} already exists`);

        const createdAirplane = await prisma.airplane.create({
            data: {
                ...airplaneData,
                airplane_id: randomUUID()
            }
        });

        const columnBusiness = ['A', 'B', 'C', 'D'];
        if (airplaneData.total_business % 4 !== 0 || airplaneData.total_business < 0) throw new HttpException(400, 'Total business must be divisible by 4');
        const totalBusinessRows = airplaneData.total_business / columnBusiness.length;
        await prisma.seat.createMany({
            data: Array.from({ length: airplaneData.total_business }, (_, index) => {
                return {
                    seat_id: randomUUID(),
                    airplane_id: createdAirplane.airplane_id,
                    number: `${Math.floor(index / columnBusiness.length) + 1}${columnBusiness[index % columnBusiness.length]}`,
                    class: 'business',
                };
            })
        });

        const columnEconomy = ['A', 'B', 'C', 'D', 'E', 'F'];
        if (airplaneData.total_economy % 6 !== 0 || airplaneData.total_economy < 0) throw new HttpException(400, 'Total economy must be divisible by 6');
        await prisma.seat.createMany({
            data: Array.from({ length: airplaneData.total_economy }, (_, index) => {
                return {
                    seat_id: randomUUID(),
                    airplane_id: createdAirplane.airplane_id,
                    number: `${Math.floor(index / columnEconomy.length) + totalBusinessRows + 1}${columnEconomy[index % columnEconomy.length]}`,
                    class: 'economy',
                };
            })
        });

        await this.incrementCacheVersion();

        return createdAirplane;
    }

    public async getAllAirplane(page: number): Promise<object> {
        const version = await this.getCacheVersion();
        const redisKey = `airplane:all:v${version}:${page}`;
        const cache = await redisClient.get(redisKey);
        if (cache) return JSON.parse(cache);

        const limit = 10;
        const skip = (page - 1) * limit;

        const totalAirplane = await prisma.airplane.count();
        const airplanes = await prisma.airplane.findMany({
            skip: skip,
            take: limit,
        });

        const totalPages = Math.ceil(totalAirplane / limit);
        const metadata = {
            airplanes: airplanes,
            totalPages: totalPages,
            currentPage: page
        };

        await redisClient.set(redisKey, JSON.stringify(metadata), { EX: 60 * 5 });

        return metadata;
    }

    public async getAirplaneInfo(airplane_id: string): Promise<object> {
        const redisKey = `airplane:${airplane_id}`;
        const cache = await redisClient.get(redisKey);
        if (cache) return JSON.parse(cache);

        const airplane = await prisma.airplane.findUnique({
            where: {
                airplane_id: airplane_id
            }
        });
        if (!airplane) throw new HttpException(404, `Airplane with id ${airplane_id} not found`);

        await redisClient.set(redisKey, JSON.stringify(airplane), { EX: 60 * 5 });

        return airplane;
    }

    public async updateAirplane(airplane_id: string, airplaneData: Airplane): Promise<object> {
        if (!airplane_id || !airplaneData) throw new HttpException(400, 'No data');

        const existsAirplane = await prisma.airplane.findUnique({
            where: {
                airplane_id: airplane_id
            }
        });
        if (!existsAirplane) throw new HttpException(404, `Airplane with id ${airplane_id} not found`);

        const columnBusiness = ['A', 'B', 'C', 'D'];
        const columnEconomy = ['A', 'B', 'C', 'D', 'E', 'F'];

        const totalBusinessRows = airplaneData.total_business / columnBusiness.length;

        // Change Business Seat if change total_business
        if (airplaneData.total_business !== existsAirplane.total_business && existsAirplane.total_business !== undefined) {
            const diff = airplaneData.total_business - existsAirplane.total_business;

            if (diff > 0) {
                const startNum = Math.floor(existsAirplane.total_business / columnBusiness.length) + 1;
                await prisma.seat.createMany({
                    data: Array.from({ length: diff }, (_, index) => {
                        return {
                            seat_id: randomUUID(),
                            airplane_id: airplane_id,
                            number: `${startNum + Math.floor(index / columnBusiness.length)}${columnBusiness[index % columnBusiness.length]}`,
                            class: 'business',
                        };
                    })
                });
            } else if (diff < 0) {
                const seatsToDelete = await prisma.seat.findMany({
                    where: {
                        airplane_id: airplane_id,
                        class: 'business'
                    },
                    orderBy: {
                        number: 'desc'
                    },
                    take: Math.abs(diff)
                });

                const seatIdsToDelete = seatsToDelete.map(seat => seat.seat_id);
                await prisma.seat.deleteMany({
                    where: {
                        seat_id: {
                            in: seatIdsToDelete
                        }
                    }
                });
            }
        }

        // Change Economy Seat if change total_economy
        if (airplaneData.total_economy !== existsAirplane.total_economy && existsAirplane.total_economy !== undefined) {
            const diff = airplaneData.total_economy - existsAirplane.total_economy;

            if (diff > 0) {
                const startNum = totalBusinessRows + Math.floor(existsAirplane.total_economy / columnEconomy.length) + 1;
                await prisma.seat.createMany({
                    data: Array.from({ length: diff }, (_, index) => {
                        return {
                            seat_id: randomUUID(),
                            airplane_id: airplane_id,
                            number: `${startNum + Math.floor(index / columnEconomy.length)}${columnEconomy[index % columnEconomy.length]}`,
                            class: 'economy',
                        };
                    })
                });
            } else if (diff < 0) {
                const seatsToDelete = await prisma.seat.findMany({
                    where: {
                        airplane_id: airplane_id,
                        class: 'economy'
                    },
                    orderBy: {
                        number: 'desc'
                    },
                    take: Math.abs(diff)
                });

                const seatIdsToDelete = seatsToDelete.map(seat => seat.seat_id);
                await prisma.seat.deleteMany({
                    where: {
                        seat_id: {
                            in: seatIdsToDelete
                        }
                    }
                });
            }
        }

        const updatedAirplane = await prisma.airplane.update({
            where: {
                airplane_id: airplane_id
            },
            data: {
                ...airplaneData
            }
        });

        await redisClient.del(`airplane:${airplane_id}`);
        await this.incrementCacheVersion();

        return updatedAirplane;
    }

    public async deleteAirplane(airplane_id: string): Promise<void> {
        const existsAirplane = await prisma.airplane.findUnique({
            where: {
                airplane_id: airplane_id
            }
        });
        if (!existsAirplane) throw new HttpException(404, `Airplane with id ${airplane_id} not found`);

        // Transaction to delete airplane and seats
        await prisma.$transaction(async (prisma) => {
            try {
                await prisma.seat.deleteMany({
                    where: {
                        airplane_id: airplane_id
                    }
                });

                await prisma.airplane.delete({
                    where: {
                        airplane_id: airplane_id
                    }
                });
            } catch (err) {
                throw new HttpException(500, 'Transaction failed');
            }
        });

        await redisClient.del(`airplane:${airplane_id}`);
        await this.incrementCacheVersion();

        return;
    }
}

export default AirplaneService;
