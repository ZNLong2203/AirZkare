import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { PrismaClientInstance } from '../db/PrismaClient';
import { HttpException } from '../exceptions/HttpException';
import { User } from '../interfaces/user.interface';
import { Token } from '../interfaces/token.interface';

const prisma = PrismaClientInstance();

class AuthService {
    public async register(userData: User): Promise<User> {
        if(!userData) throw new HttpException(400, 'No data');

        const findUser: User = await prisma.user.findUnique({
            where: {
                email: userData.email
            }
        })
        if(findUser) throw new HttpException(409, `Email ${userData.email} already exists`);

        const hashedPassword = await hash(userData.password, 10);
        const createdUser: User = await prisma.user.create({
            data: {
                ...userData,
                password: hashedPassword,
            }
        })

        return createdUser;
    }

    public async login(userData: User): Promise<Token> {
        if(!userData) throw new HttpException(400, 'No data');
        
        const findUser: User = await prisma.user.findUnique({
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
        const createdToken: Token = await prisma.token.create({
            data: {
                user_id: findUser.user_id,
                token: token,
            }
        })

        return createdToken;
    }
}

export default AuthService;