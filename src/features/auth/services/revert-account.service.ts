import { ClientRouters } from "@/routers/client-router";
import { VerificationTokenRepository } from "../repositories/verification-token.respository";
import { EmailService } from "./email.service";
import { ResourceUnprocessableEntity } from "@/shared/errors/resource-error";
import { UserRepository } from "../repositories/user.repositoriy";
import { RateLimiterService } from "./rate-limit.service";
import { RevertAccountSchema } from "../schemas/revert-account.schema";
import bcrypt from "bcrypt";
import { SessionRepository } from "../repositories/session.repository";

interface SendRevertAccountEmailParams {
  email: string;
  vercelTlsFingerprint: string | null;
}

interface VerifyRevertAccountTokenParams {
  vercelTlsFingerprint: string | null;
  input: RevertAccountSchema;
}

interface GenerateUrlParams {
  email: string;
  token: string;
  tokenId: string;
}
// DOC: this service is responsible for sending revert password change email
export const RevertAccountService = {
  // DOC: Send revert password change
  async send({ email, vercelTlsFingerprint }: SendRevertAccountEmailParams) {
    // DOC: implement rate limiter
    const redisSendRevertPasswordKey = `token:forgot-password|type:revert-password-send|fg:${vercelTlsFingerprint}`;
    const cfgLimiter = { key: redisSendRevertPasswordKey, limit: 3, windowSeconds: 60 * 15 };
    await RateLimiterService.fixedWindow(cfgLimiter);

    const user = await UserRepository.getByEmail(email);
    if (!user) throw new ResourceUnprocessableEntity("User not found");

    // DOC: Generate revert token
    const revertToken = VerificationTokenRepository.generateToken();
    const revertTokenId = VerificationTokenRepository.generateToken();
    const revertTokenUrl = this.generateUrlRevertPasswordChange({ email, token: revertToken, tokenId: revertTokenId });

    // DOC: Generate revert tokenn redis key
    const redisRevertTokenKey = `token:forgot-password|type:revert|email:${email}:tokenId:${revertTokenId}`;
    const cfg = { key: redisRevertTokenKey, token: revertToken, ttlSeconds: 7 * 24 * 60 * 60 };
    await VerificationTokenRepository.storeToken(cfg);

    await EmailService.sendPasswordResetEmailRevert({ email, url: revertTokenUrl, name: user.name });
  },

  // DOC: Verify revert token and reset password
  async verify({ input, vercelTlsFingerprint }: VerifyRevertAccountTokenParams) {
    const { email, password, token, tokenId } = input;

    // DOC: implement rate limiter
    const redisSendRevertPasswordKey = `token:forgot-password|type:revert-password-verify|fg:${vercelTlsFingerprint}`;
    const cfgLimiter = { key: redisSendRevertPasswordKey, limit: 3, windowSeconds: 60 * 15 };
    await RateLimiterService.fixedWindow(cfgLimiter);

    const user = await UserRepository.getByEmail(email);
    if (!user) throw new ResourceUnprocessableEntity("User not found");

    // DOC: Get existing token and validate
    const redisRevertTokenKey = `token:forgot-password|type:revert|email:${email}:tokenId:${tokenId}`;
    const { existingToken } = await VerificationTokenRepository.getExistingToken(redisRevertTokenKey);
    if (!existingToken) throw new ResourceUnprocessableEntity("Token invalid or expired, please try again");

    const isSame = VerificationTokenRepository.isTokenSame(existingToken, token);
    if (!isSame) throw new ResourceUnprocessableEntity("Token invalid or expired, please try again");

    // DOC: Hash password, update and revoke all sessions
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserRepository.updatePassword(user.email, hashedPassword);
    await SessionRepository.revokeSessionsByUserId(user.id);

    // DOC: Cleanup redis keys
    await VerificationTokenRepository.deleteToken(redisRevertTokenKey);
    await VerificationTokenRepository.deleteToken(redisSendRevertPasswordKey);
  },

  // DOC: Generate URL for revert password
  generateUrlRevertPasswordChange({ email, token, tokenId }: GenerateUrlParams) {
    const baseUrl = process.env.BASE_URL;
    return `${baseUrl}${ClientRouters.REVERT_ACCOUNT}?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}&tokenId=${encodeURIComponent(tokenId)}`;
  },
};
