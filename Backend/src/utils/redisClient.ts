import { createClient } from "redis";
import logger from "./logger";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (error) => {
  logger.error("Redis error:", error);
});

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    logger.info("Connected to Redis");
  }
}

void connectRedis();

export default redisClient;
