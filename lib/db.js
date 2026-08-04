// import { PrismaClient } from '@prisma/client';
// 

import { PrismaClient } from "@prisma/client";

/** @type {PrismaClient} */
const prismaClientSingleton = () => {
  return new PrismaClient();
};

const globalForPrisma = globalThis;

/** @type {PrismaClient} */
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export { prisma };

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}