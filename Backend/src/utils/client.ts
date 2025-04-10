// Determine the correct Prisma Client path based on the environment
const prismaClientPath =
  process.env.NODE_ENV === "test"
    ? "../../prisma/app/generated/prisma/test"
    : "../../prisma/app/generated/prisma/client";

const { PrismaClient } = require(prismaClientPath) as typeof import("../../prisma/app/generated/prisma/client");

// Use a global variable to prevent multiple Prisma instances in development
const globalForPrisma = global as unknown as { prisma?: InstanceType<typeof PrismaClient> };

// Create a singleton Prisma client
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Prevent multiple instances in development mode (useful for hot reloading)
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;