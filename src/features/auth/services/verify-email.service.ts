import { ResourceUnprocessableEntity } from "@/shared/errors/resource-error";
import { OtpRepository } from "../repositories/otp.repository";
import { UserRepository } from "../repositories/user.repositoriy";
import { RateLimiterService } from "./rate-limit.service";
import { EmailService } from "./email.service";
import { TokenService } from "./token.service";

export const VerifyEmailService = {
  send: async (userId: string) => {
    let otp = null;

    // DOC: implement rate limiter
    const redisSendOtpKey = `otp:email|type:send|uid:${userId}`;
    const cfgLimiter = { key: redisSendOtpKey, limit: 3, windowSeconds: 60 * 15 };
    await RateLimiterService.fixedWindow(cfgLimiter);

    // DOC: get existing otp
    const { existingOtp } = await OtpRepository.getExistingOtp(redisSendOtpKey);
    if (existingOtp) await OtpRepository.deleteOtp(redisSendOtpKey);

    otp = OtpRepository.generateOtp(6);

    // DOC: store new otp
    const cfg = { key: redisSendOtpKey, otp, ttlSeconds: 15 * 60 };
    await OtpRepository.storeOtp(cfg);

    // DOC: get user by id
    const userData = await UserRepository.getById(userId);
    if (!userData) throw new ResourceUnprocessableEntity("User not found");

    // DOC: send email
    const payload = { name: userData.name, email: userData.email, otp };
    await EmailService.sendVerifyEmail(payload);
  },

  verify: async (userId: string, inputOtp: string, sessionId: string) => {
    // DOC: implement rate limiter
    const redisVerifyKey = `otp:email|type:verify|uid:${userId}`;
    const cfgLimiter = { key: redisVerifyKey, limit: 5, windowSeconds: 60 * 10 };
    await RateLimiterService.fixedWindow(cfgLimiter);

    // DOC: get existing otp and validate
    const redisSendOtpKey = `otp:email|type:send|uid:${userId}`;
    const { existingOtp } = await OtpRepository.getExistingOtp(redisSendOtpKey);

    if (!existingOtp) {
      throw new ResourceUnprocessableEntity("OTP invalid or expired, please try again");
    }

    const isSame = OtpRepository.isOtpSame(existingOtp, inputOtp);

    if (!isSame) {
      throw new ResourceUnprocessableEntity("OTP invalid or expired, please try again");
    }

    // DOC: update user and give new access token
    const result = await UserRepository.updateVerifiedAt(userId, new Date());
    const newAccessToken = await TokenService.signAccessToken({ userId, sessionId, verifiedAt: result.verifiedAt });

    // DOC: Cleanup redis keys
    await OtpRepository.deleteOtp(redisVerifyKey);
    await OtpRepository.deleteOtp(redisSendOtpKey);

    return { accessToken: newAccessToken };
  },
};
