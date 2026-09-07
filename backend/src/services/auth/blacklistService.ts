import redisClient from "../../config/redis.js";

/**
 * Adds a JWT to the Redis blacklist to secure a user logout.
 * @param token The JWT string to revoke.
 * @param expiresInSeconds The remaining time-to-live (TTL) of the token.
 */
export const blacklistToken = async (
  token: string,
  expiresInSeconds: number,
): Promise<void> => {
  if (expiresInSeconds <= 0) return;

  await redisClient.set(token, "revoked", {
    EX: expiresInSeconds,
  });
};

/**
 * Checks if a JWT is blacklisted during authentication.
 * @param token The JWT string.
 * @returns boolean True if the token is revoked.
 */
export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  const result = await redisClient.get(token);
  return result === "revoked";
};
