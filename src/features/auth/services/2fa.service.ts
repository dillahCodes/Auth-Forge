import { ResourceUnprocessableEntity } from "@/shared/errors/resource-error";
import { OtpRepository } from "../repositories/otp.repository";
import { UserRepository } from "../repositories/user.repositoriy";
import { TwoFaSchema, TwoFaScopeSchema } from "../schemas/2fa.schema";
import { EmailService } from "./email.service";
import { RateLimiterService } from "./rate-limit.service";
import { TokenService } from "./token.service";

interface VerifyOtpParams {
  userId: string;
  sessionId: string;
  input: TwoFaSchema;
}

interface SendOtpParams {
  userId: string;
  location: string;
  input: TwoFaScopeSchema;
}

export const TwoFaService = {
  async sendOtp({ location, input, userId }: SendOtpParams) {
    let otp = null;

    // DOC: implement rate limiter
    const redisSendOtpKey = `otp:2fa|type:send|uid:${userId}:scope:${input.scope}`;
    const cfgLimiter = { key: redisSendOtpKey, limit: 3, windowSeconds: 60 * 15 };
    await RateLimiterService.fixedWindow(cfgLimiter);

    const { existingOtp } = await OtpRepository.getExistingOtp(redisSendOtpKey);
    if (existingOtp) await OtpRepository.deleteOtp(redisSendOtpKey);

    otp = OtpRepository.generateOtp(6);

    const cfg = { key: redisSendOtpKey, otp, ttlSeconds: 15 * 60 };
    await OtpRepository.storeOtp(cfg);

    const userData = await UserRepository.getById({ userId });
    if (!userData) throw new ResourceUnprocessableEntity("User not found");

    const sendTwoFaArgs = { name: userData.name, email: userData.email, otp, location };
    await EmailService.sendTwoFactorEmail(sendTwoFaArgs);
  },

  async verifyOtp({ sessionId, userId, input }: VerifyOtpParams) {
    const { scope, otp: inputOtp } = input;
    const invalidMessage = "OTP invalid or expired, please try again";

    const redisVerifyKey = `otp:2fa|type:verify|uid:${userId}:scope:${scope}`;
    const cfgLimiter = { key: redisVerifyKey, limit: 5, windowSeconds: 60 * 15 };
    await RateLimiterService.fixedWindow(cfgLimiter);

    const redisSendOtpKey = `otp:2fa|type:send|uid:${userId}:scope:${scope}`;
    const { existingOtp } = await OtpRepository.getExistingOtp(redisSendOtpKey);
    if (!existingOtp) throw new ResourceUnprocessableEntity(invalidMessage);

    const isSame = OtpRepository.isOtpSame(existingOtp, inputOtp);
    if (!isSame) throw new ResourceUnprocessableEntity(invalidMessage);

    const twoFaToken = await TokenService.signTwoFaToken({ userId, scope, sessionId });

    await OtpRepository.deleteOtp(redisVerifyKey);
    await OtpRepository.deleteOtp(redisSendOtpKey);

    return { twoFaToken };
  },
};
