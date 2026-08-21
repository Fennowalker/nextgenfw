import { PrismaClient } from '@prisma/client';

/* ─── PRISMA SINGLETON CLIENT ───────────────────────────────
   Prevents instantiating multiple PrismaClient instances
   during Next.js hot-reloading in development mode.
──────────────────────────────────────────────────────────── */

const globalForPrisma = globalThis;

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
