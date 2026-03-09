import { ResourceUnprocessableEntity } from "@/shared/errors/resource-error";
import { OtpRepository } from "../repositories/otp.repository";
import { UserRepository } from "../repositories/user.repositoriy";
import { EmailService } from "./email.service";
import { RateLimiterService } from "./rate-limit.service";
import { TokenService } from "./token.service";
import { AuthProvider } from "../../../../prisma/generated/enums";

interface VerifyEmailParams {
  userId: string;
  inputOtp: string;
  sessionId: string;
  provider: AuthProvider;
}

type OtpSendVerification = string | null;

export const VerifyEmailService = {
  send: async (userId: string) => {
    let otp: OtpSendVerification = null;

    const redisSendOtpKey = `otp:email|type:send|uid:${userId}`;
    const cfgLimiter = { key: redisSendOtpKey, limit: 3, windowSeconds: 60 * 30 };
    await RateLimiterService.fixedWindow(cfgLimiter);

    const { existingOtp } = await OtpRepository.getExistingOtp(redisSendOtpKey);
    if (existingOtp) await OtpRepository.deleteOtp(redisSendOtpKey);

    const userData = await UserRepository.getById({ userId });
    if (!userData) throw new ResourceUnprocessableEntity("User not found");

    otp = OtpRepository.generateOtp(6);
    const cfg = { key: redisSendOtpKey, otp, ttlSeconds: 15 * 60 };
    await OtpRepository.storeOtp(cfg);

    const verifyEmailArgs = { name: userData.name, email: userData.email, otp };
    await EmailService.sendVerifyEmail(verifyEmailArgs);
  },

  verify: async (params: VerifyEmailParams) => {
    const { userId, inputOtp, sessionId, provider } = params;
    const invalidMessage = "OTP invalid or expired, please try again";

    const redisVerifyKey = `otp:email|type:verify|uid:${userId}`;
    const cfgLimiter = { key: redisVerifyKey, limit: 5, windowSeconds: 60 * 10 };
    await RateLimiterService.fixedWindow(cfgLimiter);

    const redisSendOtpKey = `otp:email|type:send|uid:${userId}`;
    const { existingOtp } = await OtpRepository.getExistingOtp(redisSendOtpKey);
    if (!existingOtp) throw new ResourceUnprocessableEntity(invalidMessage);

    const isSame = OtpRepository.isOtpSame(existingOtp, inputOtp);
    if (!isSame) throw new ResourceUnprocessableEntity(invalidMessage);

    const userData = await UserRepository.getById({ userId });
    if (!userData) throw new ResourceUnprocessableEntity("User not found");

    // DOC: update user and give new access token
    const { verifiedAt } = await UserRepository.updateVerifiedAt({ userId, verifiedAt: new Date() });
    const newAccessToken = await TokenService.signAccessToken({ userId, sessionId, verifiedAt, provider });

    await OtpRepository.deleteOtp(redisVerifyKey);
    await OtpRepository.deleteOtp(redisSendOtpKey);
    return { accessToken: newAccessToken };
  },
};
