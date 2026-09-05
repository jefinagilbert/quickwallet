import { createClient, type RedisClientType } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisUrl: string = process.env.REDIS_URL || "redis://localhost:6379";

const redisClient: RedisClientType = createClient({
  url: redisUrl,
});

redisClient.on("error", (err: Error) => {
  console.error("Redis Client Error:", err.message);
});

redisClient.on("connect", () => {
  console.log("Redis connected successfully...");
});

if (process.env.NODE_ENV !== "test") {
  redisClient.connect().catch((err: Error) => {
    console.error("Failed to connect to Redis:", err.message);
  });
}

export default redisClient;
