//import RedisMock from "ioredis-mock";
import { execSync } from "child_process";
import { app } from "./index"; // Import the app instance
import { Data } from "./utils/types";

jest.mock("./utils/redisClient", () => ({
  __esModule: true,
  default: {
    get: jest.fn(() => null), 
    set: jest.fn(() => Promise.resolve()), 
    del: jest.fn(() => Promise.resolve()), 
    scan: jest.fn(() => Promise.resolve({ cursor: 0, keys: [] })), 
  },
}));


jest.mock("./utils/token", () => {
  const originalModule: typeof import("./utils/token") = jest.requireActual("./utils/token");
  
  return {
    ...originalModule,
    verifyToken: jest.fn((token: string): Data => {
      return {
        item: {
          id: "1",
          email: "test@test.com",
          name: "Test User",
          picture: "https://example.com/picture.jpg",
          iat: 1234567890,
          exp: 1234567890,
          role: token === "admin" ? "admin" : (token === "user" ? "user" : "owner"),
        },
        iat: 1234567890,
        exp: 1234567890,
      };
    }),
  };
  
});

export const setupTestDatabase = async () => {
  const uniqueDbName = `file:test-${Date.now()}-${Math.random()}?mode=memory&cache=shared`;
  process.env.DATABASE_URL = uniqueDbName;
  
  execSync(`npx prisma db push --schema=prisma/schema.test.prisma`, {
    env: { ...process.env, DATABASE_URL: uniqueDbName },
  });

  execSync(`npx prisma generate --schema=prisma/schema.test.prisma`);
  
  //@ts-ignore: Prisma Client is generated dynamically
  const { PrismaClient } = await import("../prisma/app/generated/prisma/test");
  const prisma = new PrismaClient();
  await prisma.$connect();
  await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = ON;`);

  (global as typeof globalThis).prisma = prisma;
  (global as typeof globalThis).app = app;

  return prisma;
};