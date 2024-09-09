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
        const seatEconomy = await prisma.seat.createMany({
            data: airplaneData.total_economy > 0 ? Array.from({ length: airplaneData.total_economy * columnEconomy.length}, (_, index) => {
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
        const seatBusiness = await prisma.seat.createMany({
            data: airplaneData.total_business > 0 ? Array.from({ length: airplaneData.total_business * columnBusiness.length}, (_, index) => {
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
}

export default AirplaneService;
