import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { PrismaClientInstance } from '../db/PrismaClient';
import { HttpException } from '../exceptions/HttpException';
import { User } from '../interfaces/user.interface';
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
        await prisma.user.create({
            data: {
                ...userData,
                user_id: randomUUID(),
                password: hashedPassword,
            }
        })

        return;
    }

    public async login(userData: User): Promise<{token: string}> {
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
            name: findUser.name,
        }, process.env.JWT_SECRET!, { expiresIn: '1d' });
        const createdToken = await prisma.token.create({
            data: {
                token_id: randomUUID(),
                user_id: findUser.user_id,
                token: token,
            }
        })

        return { 
            token: createdToken.token, 
        };
    }
}

export default AuthService;