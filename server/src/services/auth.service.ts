import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { PrismaClientInstance } from '../db/PrismaClient';
import { HttpException } from '../exceptions/HttpException';
import { User } from '../interfaces/user.interface';
import { Login } from '../interfaces/auth.interface';
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
                dob: new Date(),
            }
        })

        return;
    }

    public async login(userData: User): Promise<Login> {
        if (!userData) throw new HttpException(400, 'No data provided');
      
        const findUser = await prisma.user.findUnique({
          where: {
            email: userData.email,
          },
        });
        if (!findUser) throw new HttpException(401, 'Invalid email or password');
      
        const passwordMatches: boolean = await compare(userData.password, findUser.password);
        if (!passwordMatches) throw new HttpException(401, 'Invalid email or password');
      
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
          throw new Error('JWT_SECRET is not defined in environment variables');
        }
      
        const tokenPayload = {
          user_id: findUser.user_id,
          email: findUser.email,
          username: findUser.username,
          role: findUser.role,
        };
      
        const accessToken: string = sign(tokenPayload, jwtSecret, { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN });
        const refreshToken: string = sign(tokenPayload, jwtSecret, { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN });
      
        return {
          user_id: findUser.user_id,
          username: findUser.username,
          email: findUser.email,
          role: findUser.role!,
          accessToken: accessToken,
          refreshToken: refreshToken,
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

        return;
    }

    public async refreshToken(refreshToken: string): Promise<string> {    
        const payload = verify(refreshToken, process.env.JWT_SECRET as string) as Login;
    
        const user = await prisma.user.findUnique({
            where: { user_id: payload.user_id }
        });
    
        if (!user) {
            throw new HttpException(401, 'Invalid refresh token');
        }
    
        const newAccessToken: string = sign({
            user_id: user.user_id,
            email: user.email,
            username: user.username,
            role: user.role,
        }, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN });
    
        return newAccessToken;
    }
    
}

export default AuthService;