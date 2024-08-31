import { PrismaClientInstance } from "../db/PrismaClient";
import { HttpException } from "../exceptions/HttpException";
import { Passenger } from "../interfaces/passsenger.interface";
import { User } from "../interfaces/user.interface";

const prisma = PrismaClientInstance();

class PassengerService {
    public async getPassenger(user_id: string): Promise<object> {
        if(!user_id) throw new HttpException(400, 'No data');

        const findPassenger = await prisma.user.findUnique({
            where: {
                user_id: user_id,
            },
            include: {
                passenger: true,
            },
        })
        if(!findPassenger) throw new HttpException(409, 'Passengers not found');

        return findPassenger;
    }

    public async getAllPassenger(): Promise<object[]> {
        const findAllPassenger = await prisma.user.findMany({
            include: {
                passenger: true,
            }
        })
         
        return findAllPassenger;
    }
}

export default PassengerService;

