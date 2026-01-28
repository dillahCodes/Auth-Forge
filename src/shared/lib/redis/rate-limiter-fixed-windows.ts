import { getRedis } from "./redis";

export interface RateLimiterFixedWindowOptions {
  key: string;
  limit: number;
  windowSeconds: number;
}

interface RateLimiterFixedWindowResult {
  isAllowed: boolean;
  remaining: number;
  retryAfter: number;
}

const LUA_FIXED_WINDOW_SCRIPT = `
  local rateLimitKey = KEYS[1]
  local limit = tonumber(ARGV[1])
  local windowSeconds = tonumber(ARGV[2])

  -- Increment value
  redis.call('incr', rateLimitKey)

  -- calculate attempt
  local currentAttempt = tonumber(redis.call('get', rateLimitKey))

  -- set expire time
  if currentAttempt == 1 then
    redis.call('expire', rateLimitKey, windowSeconds)
  end
  
  -- calculate result
  local isAllowed = 0
  local remaining = math.max(0, limit - currentAttempt)
  local retryAfter = tonumber(redis.call('ttl', rateLimitKey))

  if currentAttempt <= limit then
    isAllowed = 1
  end

  return { isAllowed, remaining, retryAfter }
`;

export async function rateLimiterFixedWindow({
  key,
  limit,
  windowSeconds,
}: RateLimiterFixedWindowOptions): Promise<RateLimiterFixedWindowResult> {
  const redis = await getRedis();

  const rateLimiterKey = `limiter:${key}`;

  const rawResult = await redis.eval(LUA_FIXED_WINDOW_SCRIPT, {
    keys: [rateLimiterKey],
    arguments: [limit.toString(), windowSeconds.toString()],
  });

  if (!rawResult) throw new Error("Eval fixed window returned null");
  const resultMapped = Array.isArray(rawResult) ? rawResult : [rawResult];

  return {
    isAllowed: Boolean(resultMapped[0]),
    remaining: Number(resultMapped[1]),
    retryAfter: Number(resultMapped[2]),
  };
}
