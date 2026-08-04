import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: ["query", "error", "warn"],
    });
  }
  return globalForPrisma.prisma;
}

export const prisma = new Proxy({}, {
  get(target, prop) {
    const client = getPrismaClient();
    return client[prop];
  }
});