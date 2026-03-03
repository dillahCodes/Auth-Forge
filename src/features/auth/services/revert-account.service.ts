import { ClientRouters } from "@/routers/client-router";
import { ResourceUnprocessableEntity } from "@/shared/errors/resource-error";
import { prisma } from "@/shared/lib/prisma";
import { buildQueryParams } from "@/shared/utils/build-query-params";
import bcrypt from "bcrypt";
import { EmailChangeRequestRepository } from "../repositories/email-change-request.repository";
import { SessionRepository } from "../repositories/session.repository";
import { UserRepository } from "../repositories/user.repositoriy";
import { VerificationTokenRepository } from "../repositories/verification-token.respository";
import { RevertAccountEmailSchema, RevertAccountPasswordSchema } from "../schemas/revert-account.schema";
import { EmailService } from "./email.service";
import { RateLimiterService } from "./rate-limit.service";

interface SendPasswordRevertAccount {
  email: string;
  vercelTlsFingerprint: string | null;
}

interface VerifyPasswordRevertAccount {
  vercelTlsFingerprint: string | null;
  input: RevertAccountPasswordSchema;
}

interface SendRevertAccountEmailParams {
  userId: string;
  email: string;
  newEmail: string;
  requestChangeEmailId: string;
  vercelTlsFingerprint: string | null;
}

interface VerifyEmailRevertAccount {
  vercelTlsFingerprint: string | null;
  input: RevertAccountEmailSchema;
}

interface RevertAccountUrl {
  revertToken: string;
  revertTokenId: string;
}

type RevertUrlParams = RevertAccountUrl & { email?: string };
type RevertAccountPath = ClientRouters.REVERT_ACCOUNT_EMAIL | ClientRouters.REVERT_ACCOUNT_PASSWORD;

interface RevertAccountServiceContract {
  sendRevertAccountPasswordChange: (params: SendPasswordRevertAccount) => Promise<void>;
  sendRevertAccountEmailChange: (params: SendRevertAccountEmailParams) => Promise<void>;
  verifyRevertAccountPasswordChange: (params: VerifyPasswordRevertAccount) => Promise<void>;
  verifyRevertAccountEmailChange: (params: VerifyEmailRevertAccount) => Promise<void>;
  generateUrl: <T extends RevertUrlParams>(path: RevertAccountPath, params: T) => string;
}

export const RevertAccountService: RevertAccountServiceContract = {
  async sendRevertAccountPasswordChange({ email, vercelTlsFingerprint }: SendPasswordRevertAccount) {
    const redisSendRevertPasswordKey = `token:password-change|type:revert-password-send|fg:${vercelTlsFingerprint}`;
    const cfgLimiter = { key: redisSendRevertPasswordKey, limit: 3, windowSeconds: 60 * 15 };
    await RateLimiterService.fixedWindow(cfgLimiter);

    const user = await UserRepository.getByEmail({ email });
    if (!user) throw new ResourceUnprocessableEntity("User not found");

    // DOC: Generate revert token
    const path = ClientRouters.REVERT_ACCOUNT_PASSWORD;
    const revertToken = VerificationTokenRepository.generateToken();
    const revertTokenId = VerificationTokenRepository.generateToken();
    const revertTokenUrl = RevertAccountService.generateUrl(path, { email, revertToken, revertTokenId });

    // DOC: Generate revert tokenn redis key
    const redisRevertTokenKey = `token:password-change|type:revert|email:${email}:tokenId:${revertTokenId}`;
    const cfg = { key: redisRevertTokenKey, token: revertToken, ttlSeconds: 7 * 24 * 60 * 60 };
    await VerificationTokenRepository.storeToken(cfg);

    await EmailService.sendPasswordResetEmailRevert({ email, url: revertTokenUrl, name: user.name });
  },

  async verifyRevertAccountPasswordChange({ input, vercelTlsFingerprint }: VerifyPasswordRevertAccount) {
    const { email, password, token, tokenId } = input;

    const redisSendRevertPasswordKey = `token:password-change|type:revert-password-verify|fg:${vercelTlsFingerprint}`;
    const cfgLimiter = { key: redisSendRevertPasswordKey, limit: 3, windowSeconds: 60 * 15 };
    await RateLimiterService.fixedWindow(cfgLimiter);

    const user = await UserRepository.getByEmail({ email });
    if (!user) throw new ResourceUnprocessableEntity("User not found");

    // DOC: Get existing token and validate
    const redisRevertTokenKey = `token:password-change|type:revert|email:${email}:tokenId:${tokenId}`;
    const { existingToken } = await VerificationTokenRepository.getExistingToken(redisRevertTokenKey);
    if (!existingToken) throw new ResourceUnprocessableEntity("Token invalid or expired, please try again");

    const isSame = VerificationTokenRepository.isTokenSame(existingToken, token);
    if (!isSame) throw new ResourceUnprocessableEntity("Token invalid or expired, please try again");

    // DOC: Hash password, update and revoke all sessions
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.$transaction(async (transaction) => {
      await UserRepository.updatePassword({ userId: user.id, hashedPassword, options: { transaction } });
      await SessionRepository.revokeSessionsByUserId(user.id, { transaction });
    });

    await SessionRepository.revokeAccessTokensByUserIdRedis(user.id);

    // DOC: Cleanup redis keys
    await VerificationTokenRepository.deleteToken(redisRevertTokenKey);
    await VerificationTokenRepository.deleteToken(redisSendRevertPasswordKey);
  },

  async sendRevertAccountEmailChange(params: SendRevertAccountEmailParams) {
    const { email, requestChangeEmailId, vercelTlsFingerprint, newEmail, userId } = params;

    const redisSendRevertEmailKey = `token:email-change|type:revert-email-send|fg:${vercelTlsFingerprint}`;
    const cfgLimiter = { key: redisSendRevertEmailKey, limit: 3, windowSeconds: 60 * 15 };
    await RateLimiterService.fixedWindow(cfgLimiter);

    const user = await UserRepository.getById({ userId });
    if (!user) throw new ResourceUnprocessableEntity("User not found");

    // DOC: Generate revert token
    const path = ClientRouters.REVERT_ACCOUNT_EMAIL;
    const revertToken = requestChangeEmailId;
    const revertTokenId = VerificationTokenRepository.generateToken();
    const revertTokenUrl = RevertAccountService.generateUrl(path, { revertToken, revertTokenId });

    // DOC: Generate revert tokenn redis key
    const redisRevertTokenKey = `token:email-change|type:revert|tokenId:${revertTokenId}`;
    const cfg = { key: redisRevertTokenKey, token: revertToken, ttlSeconds: 7 * 24 * 60 * 60 };
    await VerificationTokenRepository.storeToken(cfg);

    await EmailService.sendEmailChangeRevert({ name: user.name, url: revertTokenUrl, email, newEmail });
  },

  async verifyRevertAccountEmailChange({ input, vercelTlsFingerprint }: VerifyEmailRevertAccount) {
    const { password, token, tokenId } = input;

    const redisSendRevertEmailKey = `token:email-change|type:revert-email-verify|fg:${vercelTlsFingerprint}`;
    const cfgLimiter = { key: redisSendRevertEmailKey, limit: 3, windowSeconds: 60 * 15 };
    await RateLimiterService.fixedWindow(cfgLimiter);

    // DOC: Get existing token and validate
    const redisRevertTokenKey = `token:email-change|type:revert|tokenId:${tokenId}`;
    const { existingToken } = await VerificationTokenRepository.getExistingToken(redisRevertTokenKey);
    if (!existingToken) throw new ResourceUnprocessableEntity("Token invalid or expired, please try again");

    const isSame = VerificationTokenRepository.isTokenSame(existingToken, token);
    if (!isSame) throw new ResourceUnprocessableEntity("Token invalid or expired, please try again");

    const requestChangeEmail = await EmailChangeRequestRepository.findById(token);
    if (!requestChangeEmail) throw new ResourceUnprocessableEntity("Token invalid or expired, please try again");

    const hashedPassword = await bcrypt.hash(password, 10);
    const { oldEmail, userId } = requestChangeEmail;

    // DOC: update password, changeb back email and revoke all sessions
    await prisma.$transaction(async (transaction) => {
      await UserRepository.updatePassword({ userId, hashedPassword, options: { transaction } });
      await UserRepository.updateEmail({ userId, email: oldEmail, options: { transaction } });
      await SessionRepository.revokeSessionsByUserId(userId, { transaction });
    });

    // DOC: revoke all access token
    await SessionRepository.revokeAccessTokensByUserIdRedis(userId);
  },

  generateUrl<T extends RevertUrlParams>(path: string, params: T) {
    const baseUrl = process.env.BASE_URL;
    const query = buildQueryParams({ email: params.email, token: params.revertToken, tokenId: params.revertTokenId });
    return `${baseUrl}${path}?${query}`;
  },
};
