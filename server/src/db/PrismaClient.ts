import { PrismaClient } from '@prisma/client';   

let prismaInstance: PrismaClient;

export const PrismaClientInstance = () => {
    if (!prismaInstance) {
        prismaInstance = new PrismaClient();
    }
    return prismaInstance;
}