import { AppError } from "@/errors/app-error";
import {
  validateverifyEmailOtp,
  verifyEmailRateLimit,
  verifyEmailUpdateUser,
} from "@/features/auth/database/verify-email-database";
import requiredAccessToken from "@/features/auth/guard/required-access-token";
import { validateOtpVerifyEmail } from "@/features/auth/validation/verify-email-validation";
import {
  errorResponse,
  internalServerError,
  sendSuccess,
} from "@/helper/response-helper";
import { getRedis } from "@/lib/redis/redis";

export async function POST(req: Request) {
  try {
    const redis = await getRedis();
    const { userId } = await requiredAccessToken(req);

    // DOC: Apply rate limit
    const redisVerifyKey = `otp:email|type:verify|uid:${userId}`;
    await verifyEmailRateLimit({ forEndpoint: "verify", limiterKey: redisVerifyKey });

    // DOC: Get and validate OTP
    const result = await validateOtpVerifyEmail(req);
    const { otp } = result.data;

    // DOC: Get and validate otp
    const redisSendOtpKey = `otp:email|type:send|uid:${userId}`;
    await validateverifyEmailOtp({ redisSendOtpKey, otp });

    // DOC: Cleanup redis keys
    await redis.del([redisSendOtpKey, redisVerifyKey]);

    // DOC: Update user verified data
    await verifyEmailUpdateUser(userId);
    const response = sendSuccess(null, "Verification email successfully");
    return response;
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
