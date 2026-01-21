import {
  ResourceUnprocessableEntity,
  ServiceUnavailable,
  ToManyRequests,
} from "@/errors/resource-error";
import { prisma } from "@/lib/prisma";
import { rateLimiterFixedWindow } from "@/lib/redis/rate-limiter-fixed-windows";
import { getRedis } from "@/lib/redis/redis";
import bcrypt from "bcrypt";
import { Resend } from "resend";
import { VerifyResetPasswordTemplate } from "../components/verify-reset-password-tamplate";
import { ClientRouters } from "@/routers/client-router";

interface ForgotPasswordRateLimit {
  forEndpoint: "send" | "verify";
  limiterKey: string;
}

interface SendResetPasswordEmailProps {
  name: string;
  email: string;
  url: string;
}

interface ValidateTokenProps {
  redisSendOtpKey: string;
  otp: string;
}

// DOC: Rate limit
// send: 5 request per 15 minutes, verify: 5 request per 10 minutes
const FORGOT_PASSWORD_LIMIT_SECONDS = { send: 60 * 15, verify: 60 * 10 } as const;
const FORGOT_PASSWORD_LIMIT_REQUEST = { send: 5, verify: 5 } as const;

const resend = new Resend(process.env.RESEND_API_KEY);

// DOC: Apply rate limit
export async function forgotPasswordRateLimit({
  forEndpoint,
  limiterKey,
}: ForgotPasswordRateLimit) {
  const result = await rateLimiterFixedWindow({
    key: limiterKey,
    limit: FORGOT_PASSWORD_LIMIT_REQUEST[forEndpoint],
    windowSeconds: FORGOT_PASSWORD_LIMIT_SECONDS[forEndpoint],
  });

  if (!result.isAllowed) throw new ToManyRequests();
}

// DOC: Get existing OTP
export async function getExistingOtpForgotPassword(key: string) {
  const redis = await getRedis();
  const existingOtp = await redis.get(key);
  const ttl = await redis.ttl(key);
  return { existingOtp, ttl };
}

// DOC: store new OTP
export async function storeOtpForgotPassword(key: string, otp: string) {
  const redis = await getRedis();
  const saved = await redis.set(key, otp, { EX: FORGOT_PASSWORD_LIMIT_SECONDS.send });
  if (!saved) throw new ServiceUnavailable("Failed to persist OTP forgot password");
}

// DOC: Generate forgot password url
export function generateForgotPassworOtpdUrl(email: string, otp: string) {
  const baseUrl = process.env.BASE_URL;
  return `${baseUrl}${ClientRouters.FORGOT_PASSWORD_VERIFY}?email=${email}&token=${otp}`;
}

// DOC: Send reset password email
export async function sendResetPasswordEmail({
  email,
  name,
  url,
}: SendResetPasswordEmailProps) {
  const { error } = await resend.emails.send({
    from: `noreply <noreply@${process.env.RESEND_DOMAIN}>`,
    to: [email],
    subject: "Reset Password",
    react: VerifyResetPasswordTemplate({ name, url }),
  });

  if (error) throw new ServiceUnavailable("Failed to send reset password email");
}

// DOC: Validate redis token and user token
export async function validateForgotPasswordOtp({
  redisSendOtpKey,
  otp,
}: ValidateTokenProps) {
  const redis = await getRedis();
  const redisGetOtp = await redis.get(redisSendOtpKey);
  const isOtpSame = redisGetOtp === otp;
  const isInvalid = !redisGetOtp || !isOtpSame;

  if (isInvalid) {
    throw new ResourceUnprocessableEntity("OTP invalid or expired, please try again");
  }
}

// DOC: Update password with hased value
export async function forgotPasswordUpdatePassword(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const resultUpdatePassword = await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
    select: { id: true },
  });

  return resultUpdatePassword;
}
