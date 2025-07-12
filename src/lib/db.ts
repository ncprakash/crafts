import { PrismaClient } from '@/generated/prisma'; 

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prevent multiple instances of PrismaClient in dev (hot reload issue)
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Optional alias for better naming
export const db = prisma;
