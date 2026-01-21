import {
  ResourceUnprocessableEntity,
  ServiceUnavailable,
  ToManyRequests,
} from "@/errors/resource-error";
import { rateLimiterFixedWindow } from "@/lib/redis/rate-limiter-fixed-windows";
import { getRedis } from "@/lib/redis/redis";
import { Resend } from "resend";
import { VerifyEmailTemplate } from "../components/verify-email-template";
import { prisma } from "@/lib/prisma";

interface VerifyEmailRateLimit {
  forEndpoint: "send" | "verify";
  limiterKey: string;
}

interface ValidateverifyEmailOtp {
  redisSendOtpKey: string;
  otp: string;
}

// DOC: Rate limit
// send: 2 request per 15 minutes, verify: 5 request per 10 minutes
const VERIFY_EMAIL_LIMIT_SECONDS = { send: 60 * 15, verify: 60 * 10 } as const;
const VERIFY_EMAIL_LIMIT_REQUEST = { send: 2, verify: 5 } as const;

const resend = new Resend(process.env.RESEND_API_KEY);

// DOC: Apply rate limit
export async function verifyEmailRateLimit({
  forEndpoint,
  limiterKey,
}: VerifyEmailRateLimit) {
  const result = await rateLimiterFixedWindow({
    key: limiterKey,
    limit: VERIFY_EMAIL_LIMIT_REQUEST[forEndpoint],
    windowSeconds: VERIFY_EMAIL_LIMIT_SECONDS[forEndpoint],
  });

  if (!result.isAllowed) throw new ToManyRequests();
}

// DOC: Get existing OTP
export async function getExistingOtpverifyEmail(key: string) {
  const redis = await getRedis();
  const existingOtp = await redis.get(key);
  const ttl = await redis.ttl(key);
  return { existingOtp, ttl };
}

// DOC: Validate redis token and user token
export async function validateverifyEmailOtp({
  redisSendOtpKey,
  otp,
}: ValidateverifyEmailOtp) {
  const redis = await getRedis();
  const redisGetOtp = await redis.get(redisSendOtpKey);
  const isOtpSame = redisGetOtp === otp;
  const isInvalid = !redisGetOtp || !isOtpSame;

  if (isInvalid) {
    throw new ResourceUnprocessableEntity("OTP invalid or expired, please try again");
  }
}

// DOC: store new OTP
export async function storeOtpverifyEmail(key: string, otp: string) {
  const redis = await getRedis();
  const saved = await redis.set(key, otp, { EX: VERIFY_EMAIL_LIMIT_SECONDS.send });
  if (!saved) throw new ServiceUnavailable("Failed to persist OTP");
}

// DOC: update user verified data
export async function verifyEmailUpdateUser(userId: string) {
  await prisma.user.update({ where: { id: userId }, data: { verifiedAt: new Date() } });
}

// DOC: Send email verification to user
export async function sendVerifyEmail(name: string, email: string, otp: string) {
  const { error } = await resend.emails.send({
    from: `noreply <noreply@${process.env.RESEND_DOMAIN}>`,
    to: [email],
    subject: "Email Verification Code",
    react: VerifyEmailTemplate({ name, otp }),
  });

  if (error) throw new ServiceUnavailable("Failed to send verification email");
}
