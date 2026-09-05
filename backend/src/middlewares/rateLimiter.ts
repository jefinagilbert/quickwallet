import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import redisClient from "../config/redis.js";
import RedisStore from "rate-limit-redis";

export const loginRateLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
  message: {
    code: 429,
    message: "Too many login attempts",
  },
});
