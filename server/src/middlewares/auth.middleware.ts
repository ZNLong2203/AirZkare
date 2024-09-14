import { Request, Response, NextFunction } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import { User } from "../interfaces/user.interface";
import { RequestWithUser } from "../interfaces/auth.interface";
import { HttpException } from "../exceptions/HttpException";
import { PrismaClientInstance } from "../db/PrismaClient";

const prisma = PrismaClientInstance();

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const authorization = req.headers.authorization;
        if(!authorization) throw new HttpException(401, 'Unauthorized');

        const token = authorization.split(' ')[1];
        
        const decoded = verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        const user = await prisma.user.findUnique({
            where: {
                user_id: decoded.user_id,
            },
            select: {
                user_id: true,
                username: true,
                role: true,
                email: true,
            }
        })
        if(!user) throw new HttpException(401, 'Unauthorized');

        req.user = user as User;
        next();
    } catch(err) {
        next(err);
    }
}

export default authMiddleware;
