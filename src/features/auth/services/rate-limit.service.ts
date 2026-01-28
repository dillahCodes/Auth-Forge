import { TooManyRequests } from "@/shared/errors/resource-error";
import { rateLimiterFixedWindow, RateLimiterFixedWindowOptions } from "@/shared/lib/redis/rate-limiter-fixed-windows";
import { rateLimiterTokenBucket, RateLimitTokenBucketOptions } from "@/shared/lib/redis/rate-limiter-token-bucket";
import { getRedis } from "@/shared/lib/redis/redis";

export const RateLimiterService = {
  // DOC: Fixed window rate limiting
  async fixedWindow(params: RateLimiterFixedWindowOptions) {
    const result = await rateLimiterFixedWindow(params);
    if (!result.isAllowed) throw new TooManyRequests();
    return result;
  },

  // DOC: Token bucket rate limiting
  async tokenBucket(params: RateLimitTokenBucketOptions) {
    const result = await rateLimiterTokenBucket(params);
    if (!result.isAllowed) throw new TooManyRequests();
    return result;
  },

  // DOC: Clear rate limiter
  async clearLimiter(key: string) {
    const redis = await getRedis();
    redis.del(key);
  },
};
