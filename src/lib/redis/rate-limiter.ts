import { getRedis } from "./redis";

interface RateLimiterFixedWindowOptions {
  key: string;
  limit: number;
  windowSeconds: number;
}

interface RateLimiterFixedWindowResult {
  isAllowed: boolean;
  remaining: number;
  retryAfter: number;
}

export async function rateLimiterFixedWindow({
  key,
  limit,
  windowSeconds,
}: RateLimiterFixedWindowOptions) {
  const redis = await getRedis();
  await redis.incr(key);

  const currentAttempt = await redis.get(key);
  if (Number(currentAttempt) === 1) await redis.expire(key, windowSeconds);

  const timeToLife = await redis.ttl(key);

  const rateLimiterResult: RateLimiterFixedWindowResult = {
    isAllowed: Number(currentAttempt) <= limit,
    remaining: Math.max(0, limit - Number(currentAttempt)),
    retryAfter: timeToLife,
  };

  return rateLimiterResult;
}
