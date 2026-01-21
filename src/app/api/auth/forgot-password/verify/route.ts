import { AppError } from "@/errors/app-error";
import {
  forgotPasswordRateLimit,
  forgotPasswordUpdatePassword,
  validateForgotPasswordOtp,
} from "@/features/auth/database/forgot-password-database";
import { revokeAllSessionsByUserId } from "@/features/auth/database/sessions-database";
import { validateForgotPasswordForm } from "@/features/auth/validation/forgot-password-validation";
import {
  errorResponse,
  internalServerError,
  sendSuccess,
} from "@/helper/response-helper";
import { getClientInfo } from "@/lib/client-info";
import { getRedis } from "@/lib/redis/redis";

export async function POST(req: Request) {
  try {
    const redis = await getRedis();
    const { vercelTlsFingerprint } = getClientInfo(req);

    // DOC: Apply rate limit
    const redisVerifyLimiterKey = `otp:forgot-password|type:verify|fg:${vercelTlsFingerprint}`;
    await forgotPasswordRateLimit({ forEndpoint: "verify", limiterKey: redisVerifyLimiterKey });

    // DOC: Validate form data
    const result = await validateForgotPasswordForm({ req, forEndpoint: "verify" });
    const { email, password, token: otp } = result.data;

    // DOC: Get and validate token
    const redisSendOtpKey = `otp:forgot-password|type:send|email:${email}`;
    await validateForgotPasswordOtp({ redisSendOtpKey, otp });

    // DOC: Cleanup redis keys
    await redis.del([redisSendOtpKey, redisVerifyLimiterKey]);

    // DOC: Hash password. update and revoke all sessions
    const user = await forgotPasswordUpdatePassword(email, password);
    await revokeAllSessionsByUserId(user.id);

    const response = sendSuccess(null, "Password reset successfully");
    return response;
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
