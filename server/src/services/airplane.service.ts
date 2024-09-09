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
            data: airplaneData.total_economy % 6 == 0 ? Array.from({ length: airplaneData.total_economy * columnEconomy.length}, (_, index) => {
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
            data: airplaneData.total_business % 4 == 0 ? Array.from({ length: airplaneData.total_business * columnBusiness.length}, (_, index) => {
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

    public async getAllAirplane(): Promise<object[]> {
        const airplanes = await prisma.airplane.findMany();

        return airplanes;
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
        if(!airplaneData) throw new HttpException(400, 'No data');

        const existsAirplane = await prisma.airplane.findFirst({
            where: {
                airplane_id: airplane_id
            }
        })
        if(!existsAirplane) throw new HttpException(404, `Airplane with id ${airplaneData.airplane_id} not found`);

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
        const existsAirplane = await prisma.airplane.findFirst({
            where: {
                airplane_id: airplane_id
            }
        })
        if(!existsAirplane) throw new HttpException(404, `Airplane with id ${airplane_id} not found`);

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

        return;
    }
}

export default AirplaneService;
