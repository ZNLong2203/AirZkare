import { PrismaClientInstance } from "../db/PrismaClient";
import { HttpException } from "../exceptions/HttpException";
import { Passenger } from "../interfaces/passsenger.interface";
import { User } from "../interfaces/user.interface";
import redisClient from "../configs/redis.config";

const prisma = PrismaClientInstance();

class PassengerService {
    private async getCacheVersion(): Promise<number> {
        const version = await redisClient.get('passenger:cacheVersion');
        return version ? parseInt(version) : 1;
    }

    private async incrementCacheVersion(): Promise<void> {
        await redisClient.incr('passenger:cacheVersion');
    }

    public async getPassengerInfo(user_id: string): Promise<object> {
        if(!user_id) throw new HttpException(400, 'No data');

        const redisKey = `passenger:${user_id}`;
        const cache = await redisClient.get(redisKey);
        if(cache) return JSON.parse(cache);

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
        });
        if(!findPassenger) throw new HttpException(404, 'Passenger not found');

        await redisClient.set(redisKey, JSON.stringify(findPassenger), { EX: 60 * 5 });

        return findPassenger;
    }

    public async getAllPassenger(page: number): Promise<object> {
        const version = await this.getCacheVersion();
        const redisKey = `passenger:all:v${version}:${page}`;
        const cache = await redisClient.get(redisKey);
        if(cache) return JSON.parse(cache);

        const limit = 10;
        const skip = (page - 1) * limit;

        const totalPassenger = await prisma.user.count();
        const findAllPassenger = await prisma.user.findMany({
            skip: skip,
            take: limit,
            select: {
                user_id: true,
                username: true,
                email: true,
                role: true,
                passenger: true,
            }
        });

        const totalPages = Math.ceil(totalPassenger / limit);
        const metadata = {
            passengers: findAllPassenger,
            totalPages: totalPages,
            currentPage: page
        };

        await redisClient.set(redisKey, JSON.stringify(metadata), { EX: 60 * 5 });

        return metadata;
    }

    public async updatePassenger(user_id: string, passengerData: Passenger): Promise<object> {
        if (!user_id || !passengerData) throw new HttpException(400, 'No data');
    
        const existsPassenger = await prisma.passenger.findUnique({
            where: {
                passenger_id: user_id,
            }
        });
        if (!existsPassenger) throw new HttpException(404, 'Passenger not found');
    
        const updateData = { ...passengerData };
    
        if (passengerData.dob) {    
            const parsedDate = Date.parse(passengerData.dob.toString()); 
            if (!isNaN(parsedDate)) {
                updateData.dob = new Date(parsedDate);
            } else {
                throw new HttpException(400, 'Invalid date format for dob. Expected format: YYYY-MM-DD');
            }
        }
    
        const updatePassenger = await prisma.passenger.update({
            where: {
                passenger_id: user_id,
            },
            data: updateData,
        });
    
        if (!updatePassenger) throw new HttpException(500, 'Failed to update passenger');
    
        await redisClient.del(`passenger:${user_id}`);
        await this.incrementCacheVersion();
    
        const serializedData = JSON.parse(
            JSON.stringify(updatePassenger, (key, value) =>
                typeof value === 'bigint' ? value.toString() : value
            )
        );
    
        return serializedData;
    }     

    public async deletePassenger(user_id: string): Promise<void> {
        if(!user_id) throw new HttpException(400, 'No data');

        const existsPassenger = await prisma.passenger.findUnique({
            where: {
                passenger_id: user_id,
            }
        });
        if(!existsPassenger) throw new HttpException(404, 'Passenger not found');

        // Transaction to delete passenger and user
        await prisma.$transaction(async (prisma) => {
            try {
                await prisma.passenger.delete({
                    where: {
                        passenger_id: user_id,
                    }
                });
        
                await prisma.user.delete({
                    where: {
                        user_id: user_id,
                    }
                });
            } catch(err) {
                throw new HttpException(500, 'Transaction failed');
            }
        });

        await redisClient.del(`passenger:${user_id}`);
        await this.incrementCacheVersion();

        return;
    }
}

export default PassengerService;
