import { getRedis } from "./redis";

export interface RateLimitTokenBucketOptions {
  key: string;
  bucketCapacity: number;
  refillRatePerSecond: number;
}

interface RateLimiterTokenBucketResult {
  isAllowed: boolean;
  tokenRemaining: number;
}

const LUA_TOKEN_BUCKET_SCRIPT = `
    local keyToken = KEYS[1]
    local keyRefill = KEYS[2]

    local bucketCapacity = tonumber(ARGV[1])
    local refillRatePerSecond = tonumber(ARGV[2])
    local currentTimmeMs = tonumber(ARGV[3])
    local tokenUsedPerRequest = tonumber(ARGV[4])
    local ttlSeconds = tonumber(ARGV[5])

    -- Get Data Based On key
    local currentToken = tonumber(redis.call('get', keyToken))
    local lastRefillMs = tonumber(redis.call('get', keyRefill))

    -- Initialize if data is empty
    if currentToken == nil then
        currentToken = bucketCapacity
        lastRefillMs = currentTimmeMs
    end

    -- calculate time and token tobe added into bucket
    local elapsedTimeMs = currentTimmeMs - lastRefillMs
    local elapsedtimeSecond = elapsedTimeMs / 1000
    local tokenToAdd = elapsedtimeSecond * refillRatePerSecond

    -- calculate current token and token tobe added into bucket
    local newToken = math.min(bucketCapacity, currentToken + tokenToAdd)

    -- check token amount is enough for request or not
    local isAllowed = 0
    if newToken >= tokenUsedPerRequest then
        newToken = newToken - tokenUsedPerRequest
        isAllowed = 1
    end

    -- Update redis Data
    redis.call('set', keyToken, newToken, 'EX', ttlSeconds)
    redis.call('set', keyRefill, currentTimmeMs, 'EX', ttlSeconds)
    
    return { isAllowed, newToken }
`;

export async function rateLimiterTokenBucket({
  key,
  bucketCapacity,
  refillRatePerSecond,
}: RateLimitTokenBucketOptions): Promise<RateLimiterTokenBucketResult> {
  const redis = await getRedis();
  const currentTimmeMs = new Date().getTime();
  const tokenUsedPerRequest = 1;
  const refillBufferSeconds = 2;

  const rateLimiterKey = `limiter:${key}`;
  const keyLastRefill = `${rateLimiterKey}:lastRefill`;

  const ttlSeconds = Math.ceil(bucketCapacity / refillRatePerSecond) * refillBufferSeconds;

  const result = await redis.eval(LUA_TOKEN_BUCKET_SCRIPT, {
    keys: [key, keyLastRefill],
    arguments: [
      bucketCapacity.toString(),
      refillRatePerSecond.toString(),
      currentTimmeMs.toString(),
      tokenUsedPerRequest.toString(),
      ttlSeconds.toString(),
    ],
  });

  if (!result) throw new Error("Eval token bucket returned null");
  const resultMapped = Array.isArray(result) ? result : [result];

  const isAllowed = Boolean(resultMapped[0]);
  const tokenRemaining = Number(resultMapped[1]);

  return { isAllowed, tokenRemaining };
}
