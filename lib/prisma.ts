import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

// Initialize a connection pool with the pg package
const pool = new Pool({ 
  connectionString,
  connectionTimeoutMillis: 5000, // Timeout after 5 seconds if connection fails
  idleTimeoutMillis: 30000,     // Close idle clients after 30 seconds
  max: 20,                      // Maximum number of clients in the pool
});
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
