import { ServiceUnavailable } from "@/shared/errors/resource-error";
import { getRedis } from "@/shared/lib/redis/redis";
import { v4 as uuidv4 } from "uuid";

interface StoreVerificationTokenProps {
  key: string;
  token: string;
  ttlSeconds: number;
}

export const VerificationTokenRepository = {
  // DOC: Get existing verification token
  async getExistingToken(key: string) {
    const redis = await getRedis();
    const existingToken = await redis.get(key);
    const ttl = await redis.ttl(key);
    return { existingToken, ttl };
  },

  // DOC: Store verification token
  async storeToken({ key, token, ttlSeconds }: StoreVerificationTokenProps) {
    const redis = await getRedis();
    const saved = await redis.set(key, token, { EX: ttlSeconds });
    if (!saved) throw new ServiceUnavailable("Failed to persist verification token");
  },

  // DOC: Delete verification token
  async deleteToken(key: string) {
    const redis = await getRedis();
    await redis.del(key);
  },

  // DOC: Generate verification token (UUID v4)
  generateToken(): string {
    return uuidv4();
  },

  // DOC: Validate verification token
  isTokenSame(token1: string, token2: string): boolean {
    return token1 === token2;
  },
};
