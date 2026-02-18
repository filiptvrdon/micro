import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const poolConfig: pg.PoolConfig = {
  connectionString: process.env.DATABASE_URL,
};

const pool = new pg.Pool(poolConfig)
const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({ adapter })
