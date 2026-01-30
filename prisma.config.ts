// prisma.config.ts
import { PrismaClient } from "@prisma/client";

// Prisma will use the DATABASE_URL from Vercel environment variables
export const prisma = new PrismaClient({
  adapter: process.env.DATABASE_URL,
});