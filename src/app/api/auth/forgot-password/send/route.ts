import { AppError } from "@/errors/app-error";
import {
  forgotPasswordRateLimit,
  generateForgotPassworOtpdUrl,
  getExistingOtpForgotPassword,
  sendResetPasswordEmail,
  storeOtpForgotPassword,
} from "@/features/auth/database/forgot-password-database";
import { getUserByEmail } from "@/features/auth/database/login-database";
import { validateForgotPasswordForm } from "@/features/auth/validation/forgot-password-validation";
import { generateOtp } from "@/helper/generate-otp";
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

    //  DOC: validate form with zod
    const parsed = await validateForgotPasswordForm({ forEndpoint: "send", req });
    const { email } = parsed.data;

    // DOC: REDIS RATE LIMIT
    const redisSendOtpLimiterKey = `otp:forgot-password|type:send|fg:${vercelTlsFingerprint}`;
    await forgotPasswordRateLimit({
      forEndpoint: "send",
      limiterKey: redisSendOtpLimiterKey,
    });

    let otp = null;

    // DOC: Get existing OTP if found Delete and regenerate
    const redisSendOtpKey = `otp:forgot-password|type:send|email:${email}`;
    const { existingOtp } = await getExistingOtpForgotPassword(redisSendOtpKey);
    if (existingOtp) redis.del(redisSendOtpKey);

    // DOC: Generate new OTP
    otp = generateOtp(6);
    await storeOtpForgotPassword(redisSendOtpKey, otp);

    // DOC: Send success if email not found
    const userData = await getUserByEmail(email);
    if (!userData) return sendSuccess(null, "Forgot password email sent successfully");

    // DOC: generate reset password url
    const generatedUrl = generateForgotPassworOtpdUrl(userData.email, otp);

    await sendResetPasswordEmail({
      email: userData.email,
      name: userData.name,
      url: generatedUrl,
    });

    return sendSuccess(null, "Forgot password email sent successfully");
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
