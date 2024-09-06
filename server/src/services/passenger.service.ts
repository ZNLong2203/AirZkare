import { PrismaClientInstance } from "../db/PrismaClient";
import { HttpException } from "../exceptions/HttpException";
import { Passenger } from "../interfaces/passsenger.interface";
import { User } from "../interfaces/user.interface";

const prisma = PrismaClientInstance();

class PassengerService {
    public async getPassengerInfo(user_id: string): Promise<object> {
        if(!user_id) throw new HttpException(400, 'No data');

        const findPassenger = await prisma.user.findUnique({
            where: {
                user_id: user_id,
            },
            select: {
                user_id: true,
                username: true,
                email: true,
                role: true,
                passenger: true,
            }
        })
        if(!findPassenger) throw new HttpException(409, 'Passengers not found');

        return findPassenger;
    }

    public async getAllPassenger(): Promise<object[]> {
        const findAllPassenger = await prisma.user.findMany({
            select: {
                user_id: true,
                username: true,
                email: true,
                role: true,
                passenger: true,
            }
        })
         
        return findAllPassenger;
    }

    public async updatePassenger(user_id: string, passengerData: Passenger): Promise<object> {
        if(!user_id || !passengerData) throw new HttpException(400, 'No data');

        const existingPassenger = await prisma.passenger.findUnique({
            where: {
                user_id: user_id,
            }
        });
        if (!existingPassenger) throw new HttpException(404, 'Passenger not found');

        const updatePassenger = await prisma.passenger.update({
            where: {
                user_id: user_id,
            },
            data: {
                ...passengerData,
            }
        });

        const serializedData = JSON.parse(
            JSON.stringify(updatePassenger, (key, value) =>
              typeof value === 'bigint' ? value.toString() : value
            )
        );
    
        return serializedData;
    }

    public async deletePassenger(user_id: string): Promise<void> {
        if(!user_id) throw new HttpException(400, 'No data');

        await prisma.passenger.delete({
            where: {
                user_id: user_id,
            }
        })

        return;
    }
}

export default PassengerService;

