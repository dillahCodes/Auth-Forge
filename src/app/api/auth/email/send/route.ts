import { AppError } from "@/errors/app-error";
import { ResourceUnprocessableEntity } from "@/errors/resource-error";
import { getUserByUserId } from "@/features/auth/database/login-database";
import {
  getExistingOtpverifyEmail,
  sendVerifyEmail,
  storeOtpverifyEmail,
  verifyEmailRateLimit,
} from "@/features/auth/database/verify-email-database";
import requiredAccessToken from "@/features/auth/guard/required-access-token";
import { generateOtp } from "@/helper/generate-otp";
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

    //DOC: REDIS KEY RATE LIMIT
    const redisSendOtpKey = `otp:email|type:send|uid:${userId}`;
    await verifyEmailRateLimit({ forEndpoint: "send", limiterKey: redisSendOtpKey });

    let otp = null;

    // DOC: Get existing OTP
    const { existingOtp } = await getExistingOtpverifyEmail(redisSendOtpKey);
    if (existingOtp) redis.del(redisSendOtpKey);

    // DOC: Generate new OTP
    otp = generateOtp(6);
    await storeOtpverifyEmail(redisSendOtpKey, otp);

    // DOC: validate user data
    const userData = await getUserByUserId(userId);
    if (!userData) throw new ResourceUnprocessableEntity("User not found");

    // DOC: Send email to user
    await sendVerifyEmail(userData.name as string, userData.email, otp);
    return sendSuccess(null, "Verification email sent successfully");
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
