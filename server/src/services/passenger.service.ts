import { PrismaClientInstance } from "../db/PrismaClient";
import { HttpException } from "../exceptions/HttpException";
import { Passenger } from "../interfaces/passsenger.interface";
import { User } from "../interfaces/user.interface";

const prisma = PrismaClientInstance();

class PassengerService {
    public async getPassengerInfo(user_id: string): Promise<object> {
        if(!user_id) throw new HttpException(400, 'No data');

        const findPassenger = await prisma.passenger.findUnique({
            where: {
                passenger_id: user_id,
            },
            select: {
                user_id: true,
                age: true,
                gender: true,
                dob: true,
                phone: true,
                city: true,
                country: true,
                nationality: true,
                passport: true,
                membership: true,
                user: {
                    select: {
                        username: true,
                        email: true,
                        role: true,
                        image: true,
                    }
                }
            }
        })
        if(!findPassenger) throw new HttpException(409, 'Passengers not found');

        return findPassenger;
    }

    public async getAllPassenger(page: number): Promise<object> {
        const limit = 10;
        const skip = (page - 1) * limit;

        const totalPassenger = await prisma.user.count();
        const findAllPassenger = await prisma.user.findMany({
            select: {
                user_id: true,
                username: true,
                email: true,
                role: true,
                passenger: true,
            }
        })

        const totalPages = Math.ceil(totalPassenger / limit);
        const metadata = {
            passengers: findAllPassenger,
            totalPages: totalPages,
            currentPage: page
        }

        return metadata;
    }

    public async updatePassenger(user_id: string, passengerData: Passenger): Promise<object> {
        if(!user_id || !passengerData) throw new HttpException(400, 'No data');

        const updateData: Passenger = { ...passengerData };
        if(passengerData.dob) {
            updateData.dob = new Date(passengerData.dob);
        }

        const updatePassenger = await prisma.passenger.update({
            where: {
                passenger_id: user_id,
            },
            data: updateData,
        });
        if(!updatePassenger) throw new HttpException(409, 'Failed to update passenger');

        const serializedData = JSON.parse(
            JSON.stringify(updatePassenger, (key, value) =>
              typeof value === 'bigint' ? value.toString() : value
            )
        );
    
        return serializedData;
    }

    public async deletePassenger(user_id: string): Promise<void> {
        if(!user_id) throw new HttpException(400, 'No data');

        // Transaction to delete passenger, ticket, and token
        await prisma.$transaction(async (prisma) => {
            try {
                await prisma.passenger.delete({
                    where: {
                        passenger_id: user_id,
                    }
                })
        
                await prisma.user.delete({
                    where: {
                        user_id: user_id,
                    }
                })
            } catch(err) {
                throw new HttpException(500, 'Transaction failed');
            }
        })

        return;
    }
}

export default PassengerService;

