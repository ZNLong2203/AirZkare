import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { PrismaClientInstance } from '../db/PrismaClient';
import { HttpException } from '../exceptions/HttpException';
import { User } from '../interfaces/user.interface';
import { Passenger } from '../interfaces/passsenger.interface';
import { randomUUID } from 'crypto';

const prisma = PrismaClientInstance();

class AuthService {
    public async register(userData: User): Promise<void> {
        if(!userData) throw new HttpException(400, 'No data');

        const findUser = await prisma.user.findFirst({
            where: {
                email: userData.email
            }
        })
        if(findUser) throw new HttpException(409, `Email ${userData.email} already exists`);

        const hashedPassword = await hash(userData.password, 10);
        const createUser = await prisma.user.create({
            data: {
                ...userData,
                user_id: randomUUID(),
                password: hashedPassword,
            }
        })

        await prisma.passenger.create({
            data: {
                passenger_id: createUser.user_id,
                user_id: createUser.user_id,
            }
        })

        return;
    }

    public async login(userData: User): Promise<{ data: object }> {
        if(!userData) throw new HttpException(400, 'No data');
        
        const findUser = await prisma.user.findFirst({
            where: {
                email: userData.email,
            }
        })
        if(!findUser) throw new HttpException(409, `Email ${userData.email} not found`);

        const checkPassword: boolean = await compare(userData.password, findUser.password);
        if(!checkPassword) throw new HttpException(409, 'Password is incorrect');

        const token: string = sign({ 
            user_id: findUser.user_id,
            email: findUser.email,
            username: findUser.username,
            role: findUser.role,
        }, process.env.JWT_SECRET!, { expiresIn: '1d' });

        const findToken = await prisma.token.findFirst({
            where: {
                user_id: findUser.user_id,
            }
        })

        let createdToken;
        if(findToken) {
            createdToken = await prisma.token.update({
                where: {
                    token_id: findToken.token_id,
                },
                data: {
                    token: token,
                }
            })
        } else {
            createdToken = await prisma.token.create({
                data: {
                    token_id: randomUUID(),
                    user_id: findUser.user_id,
                    token: token,
                }
            })
        }

        return { 
            data: {
                user_id: findUser.user_id,
                username: findUser.username,
                email: findUser.email,
                role: findUser.role,
                token: createdToken.token,
            }, 
        };
    }

    public async logout(userData: User): Promise<void> {
        if(!userData) throw new HttpException(400, 'No data');

        const findUser = await prisma.user.findUnique({
            where: {
                user_id: userData.user_id,
            }
        })
        if(!findUser) throw new HttpException(409, `User ${userData.user_id} not found`);

        await prisma.token.deleteMany({
            where: {
                user_id: findUser.user_id,
            }
        })

        return;
    }
}

export default AuthService;