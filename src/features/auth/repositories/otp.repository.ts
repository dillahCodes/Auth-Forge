import { ServiceUnavailable } from "@/shared/errors/resource-error";
import { getRedis } from "@/shared/lib/redis/redis";

interface StoreOtpProps {
  key: string;
  otp: string;
  ttlSeconds: number;
}

export const OtpRepository = {
  // DOC: Get existing OTP
  async getExistingOtp(key: string) {
    const redis = await getRedis();
    const existingOtp = await redis.get(key);
    const ttl = await redis.ttl(key);
    return { existingOtp, ttl };
  },

  // DOC: Store OTP
  async storeOtp({ key, otp, ttlSeconds }: StoreOtpProps) {
    const redis = await getRedis();
    const saved = await redis.set(key, otp, { EX: ttlSeconds });
    if (!saved) throw new ServiceUnavailable("Failed to persist OTP");
  },

  // DOC: Delete OTP
  async deleteOtp(key: string) {
    const redis = await getRedis();
    await redis.del(key);
  },

  // DOC: Generate OTP
  generateOtp(length: number): string {
    const OTP_DIGITS = "0123456789";

    return Array.from({ length }, () => OTP_DIGITS.charAt(Math.floor(Math.random() * OTP_DIGITS.length))).join("");
  },

  // DOC: Validate OTP
  isOtpSame(otp1: string, otp2: string): boolean {
    return otp1 === otp2;
  },
};
