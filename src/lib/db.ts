// src/lib/db.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // Prevent TypeScript error on hot reload
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const db: PrismaClient =
  global.prisma ??
  new PrismaClient({
    log: ['query'], // optional, remove if too verbose
  });

if (process.env.NODE_ENV !== 'production') global.prisma = db;
