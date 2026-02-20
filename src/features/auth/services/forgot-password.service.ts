import { ClientRouters } from "@/routers/client-router";
import { ResourceUnprocessableEntity } from "@/shared/errors/resource-error";
import bcrypt from "bcrypt";
import { SessionRepository } from "../repositories/session.repository";
import { UserRepository } from "../repositories/user.repositoriy";
import { VerificationTokenRepository } from "../repositories/verification-token.respository";
import { ForgotPasswordSchema } from "../schemas/forgot-password.schema";
import { EmailService } from "./email.service";
import { RateLimiterService } from "./rate-limit.service";
import { RevertAccountService } from "./revert-account.service";

interface SendForgotPasswordEmailParams {
  vercelTlsFingerprint: string | null;
  email: string;
}

interface VerifyForgotPasswordTokenParams {
  vercelTlsFingerprint: string | null;
  input: ForgotPasswordSchema;
}

export const ForgotPasswordService = {
  // DOC: Send forgot password email
  async send({ email, vercelTlsFingerprint }: SendForgotPasswordEmailParams) {
    let token: string | null = null;

    // DOC: Implement Rate Limit
    const redisSendOtpLimiterKey = `otp:forgot-password|type:send|fg:${vercelTlsFingerprint}`;
    const cfgLimiter = { key: redisSendOtpLimiterKey, limit: 3, windowSeconds: 60 * 30 };
    await RateLimiterService.fixedWindow(cfgLimiter);

    const userData = await UserRepository.getByEmail({ email });
    if (!userData) return;

    const { name } = userData;

    // DOC: Get existing token if found, delete and regenerate
    const redisSendTokenKey = `token:forgot-password|type:send|email:${email}`;
    const { existingToken } = await VerificationTokenRepository.getExistingToken(redisSendTokenKey);

    if (existingToken) await VerificationTokenRepository.deleteToken(redisSendTokenKey);

    token = VerificationTokenRepository.generateToken();

    // DOC: Store new token
    const cfg = { key: redisSendTokenKey, token, ttlSeconds: 15 * 60 };
    await VerificationTokenRepository.storeToken(cfg);

    // DOC: Generate reset password url and send email
    const url = this.generateUrlForgotPassword(email, token);
    await EmailService.sendResetPasswordEmail({ email, url, name });
  },

  // DOC: Verify token for forgot password
  async verify({ input, vercelTlsFingerprint }: VerifyForgotPasswordTokenParams) {
    const { email, password, token } = input;

    // DOC: Apply rate limit
    const redisVerifyLimiterKey = `token:forgot-password|type:verify|fg:${vercelTlsFingerprint}`;
    const cfgLimiter = { key: redisVerifyLimiterKey, limit: 5, windowSeconds: 60 * 10 };
    await RateLimiterService.fixedWindow(cfgLimiter);

    // DOC: Get existing token and validate
    const redisSendTokenKey = `token:forgot-password|type:send|email:${email}`;
    const { existingToken } = await VerificationTokenRepository.getExistingToken(redisSendTokenKey);
    if (!existingToken) throw new ResourceUnprocessableEntity("Token invalid or expired, please try again");

    const isSame = VerificationTokenRepository.isTokenSame(existingToken, token);
    if (!isSame) throw new ResourceUnprocessableEntity("Token invalid or expired, please try again");

    const user = await UserRepository.getByEmail({ email });
    if (!user) throw new ResourceUnprocessableEntity("User not found");

    // DOC: Hash password, update and revoke all sessions
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserRepository.updatePassword({ userId: user.id, hashedPassword });
    await SessionRepository.revokeSessionsByUserId(user.id);
    await SessionRepository.revokeAllAccessTokenByUserIdRedis(user.id);

    // DOC: Cleanup redis keys
    await VerificationTokenRepository.deleteToken(redisSendTokenKey);
    await VerificationTokenRepository.deleteToken(redisVerifyLimiterKey);

    await RevertAccountService.sendRevertAccountPasswordChange({ email, vercelTlsFingerprint });
  },

  // DOC: Generate URL for forgot password
  generateUrlForgotPassword(email: string, token: string) {
    const baseUrl = process.env.BASE_URL;
    const url = `${baseUrl}${ClientRouters.FORGOT_PASSWORD_VERIFY}?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
    return url;
  },
};
