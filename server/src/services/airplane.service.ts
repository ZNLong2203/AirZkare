import { PrismaClientInstance } from "../db/PrismaClient";
import { HttpException } from "../exceptions/HttpException";
import { Airplane } from "../interfaces/airplane.interface";
import { randomUUID } from "crypto";

const prisma = PrismaClientInstance();

class AirplaneService {
    public async createAirplane(airplaneData: Airplane): Promise<object> {
        if(!airplaneData) throw new HttpException(400, 'No data');

        const existsAirplane = await prisma.airplane.findFirst({
            where: {
                name: airplaneData.name
            }
        })
        if(existsAirplane) throw new HttpException(409, `Airplane with name ${airplaneData.name} already exists`);

        const createdAirplane = await prisma.airplane.create({
            data: {
                ...airplaneData,
                airplane_id: randomUUID()
            }
        })

        const columnEconomy = ['A', 'B', 'C', 'D', 'E', 'F'];
        await prisma.seat.createMany({
            data: airplaneData.total_economy % 6 == 0 ? Array.from({ length: airplaneData.total_economy }, (_, index) => {
                return {
                    seat_id: randomUUID(),
                    airplane_id: createdAirplane.airplane_id,
                    number: `${Math.floor(index / columnEconomy.length) + 1}${columnEconomy[index % columnEconomy.length]}`,
                    class: 'economy',
                    status: 'available'
                }
            }) : []
        })

        const columnBusiness = ['A', 'B'];
        await prisma.seat.createMany({
            data: airplaneData.total_business % 4 == 0 ? Array.from({ length: airplaneData.total_business }, (_, index) => {
                return {
                    seat_id: randomUUID(),
                    airplane_id: createdAirplane.airplane_id,
                    number: `${Math.floor(index / columnBusiness.length) + 1}${columnBusiness[index % columnBusiness.length]}`,
                    class: 'business',
                    status: 'available'
                }
            }) : []
        })

        return createdAirplane;
    }

    public async getAllAirplane(page: number): Promise<object> {
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
        }

        return metadata;
    }

    public async getAirplaneInfo(airplane_id: string): Promise<object> {
        const airplane = await prisma.airplane.findUnique({
            where: {
                airplane_id: airplane_id
            }
        })
        if(!airplane) throw new HttpException(404, `Airplane with id ${airplane_id} not found`);

        return airplane;
    }

    public async updateAirplane(airplane_id: string, airplaneData: Airplane): Promise<object> {
        if(!airplane_id || !airplaneData) throw new HttpException(400, 'No data');

        const existsAirplane = await prisma.airplane.findUnique({
            where: {
                airplane_id: airplane_id
            }
        })
        if(!existsAirplane) throw new HttpException(404, `Airplane with id ${airplane_id} not found`);

        // Change Economy Seat if change total_economy
        if(airplaneData.total_economy != existsAirplane.total_economy && existsAirplane.total_economy != undefined) {
            const diff = airplaneData.total_economy - existsAirplane.total_economy;
            const columnEconomy = ['A', 'B', 'C', 'D', 'E', 'F'];
            
            if(diff > 0) {
                const startNum = (existsAirplane.total_economy / 6) + 1;
                await prisma.seat.createMany({
                    data: Array.from({ length: diff }, (_, index) => {
                        return {
                            seat_id: randomUUID(),
                            airplane_id: airplane_id,
                            number: `${startNum + index}${columnEconomy[index % columnEconomy.length]}`,
                            class: 'economy',
                            status: 'available'
                        }
                    })
                })
            } else if(diff < 0) {
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

        // Change Business Seat if change total_business
        if(airplaneData.total_business != existsAirplane.total_business && existsAirplane.total_business != undefined) {
            const diff = airplaneData.total_business - existsAirplane.total_business;
            const columnBusiness = ['A', 'B'];

            if(diff > 0) {
                const startNum = (existsAirplane.total_business / 4) + 1;
                await prisma.seat.createMany({
                    data: Array.from({ length: diff }, (_, index) => {
                        return {
                            seat_id: randomUUID(),
                            airplane_id: airplane_id,
                            number: `${startNum + index}${columnBusiness[index % columnBusiness.length]}`,
                            class: 'business',
                            status: 'available'
                        }
                    })
                })
            } else if(diff < 0) {
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
                })
            }
        }

        const updatedAirplane = await prisma.airplane.update({
            where: {
                airplane_id: airplane_id
            },
            data: {
                ...airplaneData
            }
        })

        return updatedAirplane;
    }

    public async deleteAirplane(airplane_id: string): Promise<void> {
        const existsAirplane = await prisma.airplane.findUnique({
            where: {
                airplane_id: airplane_id
            }
        })
        if(!existsAirplane) throw new HttpException(404, `Airplane with id ${airplane_id} not found`);

        // Transaction to delete airplane, flight seat, and flight
        await prisma.$transaction(async (prisma) => {
            try {
                await prisma.airplane.delete({
                    where: {
                        airplane_id: airplane_id
                    }
                })
        
                await prisma.seat.deleteMany({
                    where: {
                        airplane_id: airplane_id
                    }
                })
            } catch(err) {
                throw new HttpException(500, 'Transaction failed');
            }
        })

        return;
    }
}

export default AirplaneService;
