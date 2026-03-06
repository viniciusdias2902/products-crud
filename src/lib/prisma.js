import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString:
    "postgresql://neondb_owner:npg_AaYhGX1Rgb7U@ep-square-cloud-ach46wio-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development" ? ["query, warn, error"] : ["error"],
});

export { prisma };
