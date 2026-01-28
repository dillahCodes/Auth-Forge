import { ResourceUnprocessableEntity } from "@/shared/errors/resource-error";
import { ClientRouters } from "@/routers/client-router";
import bcrypt from "bcrypt";
import { OtpRepository } from "../repositories/otp.repository";
import { SessionRepository } from "../repositories/session.repository";
import { UserRepository } from "../repositories/user.repositoriy";
import { ForgotPasswordSchema } from "../schemas/forgot-password.schema";
import { EmailService } from "./email.service";
import { RateLimiterService } from "./rate-limit.service";

interface SendForgotPasswordEmailParams {
  vercelTlsFingerprint: string | null;
  email: string;
}

interface VerifyForgotPasswordOtpParams {
  vercelTlsFingerprint: string | null;
  input: ForgotPasswordSchema;
}

export const ForgotPasswordService = {
  // DOC: Send forgot password email
  async send({ email, vercelTlsFingerprint }: SendForgotPasswordEmailParams) {
    let otp = null;

    // DOC: Implement Rate Limit
    const redisSendOtpLimiterKey = `otp:forgot-password|type:send|fg:${vercelTlsFingerprint}`;
    const cfgLimiter = { key: redisSendOtpLimiterKey, limit: 3, windowSeconds: 60 * 15 };
    await RateLimiterService.fixedWindow(cfgLimiter);

    // DOC: Check if user exists, return if not found
    const userData = await UserRepository.getByEmail(email);
    if (!userData) return;

    const { name } = userData;

    // DOC: Get existing OTP if found Delete and regenerate
    const redisSendOtpKey = `otp:forgot-password|type:send|email:${email}`;
    const { existingOtp } = await OtpRepository.getExistingOtp(redisSendOtpKey);
    if (existingOtp) await OtpRepository.deleteOtp(redisSendOtpKey);

    otp = OtpRepository.generateOtp(6);

    // DOC: Store new OTP
    const cfg = { key: redisSendOtpKey, otp, ttlSeconds: 15 * 60 };
    await OtpRepository.storeOtp(cfg);

    // DOC: Generate reset password url and send email
    const url = this.generateUrlForgotPassword(email, otp);
    await EmailService.sendResetPasswordEmail({ email, url, name });
  },

  // DOC: Verify OTP for forgot password
  async verify({ input, vercelTlsFingerprint }: VerifyForgotPasswordOtpParams) {
    const { email, password, token } = input;

    // DOC: Apply rate limit
    const redisVerifyLimiterKey = `otp:forgot-password|type:verify|fg:${vercelTlsFingerprint}`;
    const cfgLimiter = { key: redisVerifyLimiterKey, limit: 5, windowSeconds: 60 * 10 };
    await RateLimiterService.fixedWindow(cfgLimiter);

    // DOC: Get existing OTP and validate
    const redisSendOtpKey = `otp:forgot-password|type:send|email:${email}`;
    const { existingOtp } = await OtpRepository.getExistingOtp(redisSendOtpKey);

    if (!existingOtp) {
      throw new ResourceUnprocessableEntity("OTP invalid or expired, please try again");
    }

    const isSame = OtpRepository.isOtpSame(existingOtp, token);

    if (!isSame) {
      throw new ResourceUnprocessableEntity("OTP invalid or expired, please try again");
    }

    // DOC: validate user
    const user = await UserRepository.getByEmail(email);
    if (!user) throw new ResourceUnprocessableEntity("User not found");

    // DOC: hash password, update and revoke all sessions
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserRepository.updatePassword(user.email, hashedPassword);
    await SessionRepository.revokeSessionsByUserId(user.id);

    // DOC: Cleanup redis keys
    await OtpRepository.deleteOtp(redisSendOtpKey);
    await OtpRepository.deleteOtp(redisVerifyLimiterKey);
  },

  // DOC: Generate URL for forgot password
  generateUrlForgotPassword(email: string, otp: string) {
    const baseUrl = process.env.BASE_URL;
    return `${baseUrl}${ClientRouters.FORGOT_PASSWORD_VERIFY}?email=${email}&token=${otp}`;
  },
};
