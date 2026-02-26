import { AuthInvalidCredentials } from "@/shared/errors/auth-error";
import {
  NotFound,
  OperationNotAllowed,
  ResourceConflict,
  ResourceUnprocessableEntity,
} from "@/shared/errors/resource-error";
import { prisma } from "@/shared/lib/prisma";
import bcrypt from "bcrypt";
import { EmailChangeRequestRepository } from "../repositories/email-change-request.repository";
import { OtpRepository } from "../repositories/otp.repository";
import { SessionRepository } from "../repositories/session.repository";
import { UserRepository } from "../repositories/user.repositoriy";
import {
  ChangeEmailSchema,
  ChangeEmailUpdateSchema,
  ChangeEmailVerifySchema,
  ChangePasswordSchema,
} from "../schemas/account.schema";
import { EmailService } from "./email.service";
import { RateLimiterService } from "./rate-limit.service";
import { RevertAccountService } from "./revert-account.service";
import { ProviderHelpers } from "@/shared/utils/providers-helper";

interface ChangePasswordProps {
  sessionId: string;
  input: ChangePasswordSchema;
  userId: string;
  vercelTlsFingerprint: string | null;
}

interface ChangeEmailVerify {
  sessionId: string;
  vercelTlsFingerprint: string | null;
  input: ChangeEmailVerifySchema;
  userId: string;
}

export const AccountService = {
  async changeName(name: string, userId: string) {
    const redisLimiterKey = `profile:change-name|uid:${userId}`;
    const cfgLimiter = { key: redisLimiterKey, limit: 5, windowSeconds: 60 * 15 };
    await RateLimiterService.fixedWindow(cfgLimiter);

    const isUserExist = await UserRepository.getById({ userId });
    if (!isUserExist) throw new NotFound("user not found");

    const isNameSame = isUserExist.name.toLowerCase() === name.toLocaleLowerCase();
    const nameSameError = { name: ["name cannot be the same"] };
    if (isNameSame) throw new ResourceUnprocessableEntity("please check your input", nameSameError);

    const resultUpdate = await UserRepository.updateName({ userId, name });
    return { oldName: isUserExist.name, newName: resultUpdate.name };
  },

  async changeEmailRequest(input: ChangeEmailSchema, userId: string) {
    const isUserExist = await UserRepository.getById({ userId });
    if (!isUserExist) throw new NotFound("user not found");

    const accounts = await UserRepository.getAccountsByUserId(userId);
    const isOnlyCredentialsProvider = ProviderHelpers.isOnlyCredentialsProvider(accounts);

    if (!isOnlyCredentialsProvider) {
      throw new OperationNotAllowed("Email can only be changed for accounts with credentials provider");
    }

    const emailHasUsed = await UserRepository.getByEmail({ email: input.newEmail });
    if (emailHasUsed) throw new ResourceConflict("Email already used");

    const isEmailSame = isUserExist.email.toLocaleLowerCase() === input.newEmail.toLocaleLowerCase();
    const emailSameError = { newEmail: ["new email cannot be the same"] };
    if (isEmailSame) throw new ResourceUnprocessableEntity("please check your input", emailSameError);

    const hasRequestedChangeEmail = await EmailChangeRequestRepository.findPendingByUserId(userId);
    if (hasRequestedChangeEmail) throw new ResourceConflict("Email change already requested");

    const emailChangeArgs = { userId, oldEmail: isUserExist.email, newEmail: input.newEmail };
    const resultCreateRequest = await EmailChangeRequestRepository.create(emailChangeArgs);

    return resultCreateRequest;
  },

  async changeEmailRequestUpdate(input: ChangeEmailUpdateSchema, userId: string) {
    const { newEmail, requestId } = input;

    const isUserExist = await UserRepository.getById({ userId });
    if (!isUserExist) throw new NotFound("user not found");

    const accounts = await UserRepository.getAccountsByUserId(userId);
    const isOnlyCredentialsProvider = ProviderHelpers.isOnlyCredentialsProvider(accounts);

    if (!isOnlyCredentialsProvider) {
      throw new OperationNotAllowed("Email can only be changed for accounts with credentials provider");
    }

    const emailHasUsed = await UserRepository.getByEmail({ email: input.newEmail });
    if (emailHasUsed) throw new ResourceConflict("Email already used");

    const isEmailSame = isUserExist.email.toLocaleLowerCase() === newEmail.toLocaleLowerCase();
    const emailSameError = { newEmail: ["new email cannot be the same"] };
    if (isEmailSame) throw new ResourceUnprocessableEntity("please check your input", emailSameError);

    const requestedEmailChange = await EmailChangeRequestRepository.findPendingById(requestId);
    if (!requestedEmailChange) throw new NotFound("Email change request not found");

    const resultUpdate = await EmailChangeRequestRepository.updateNewEmailpending(requestId, newEmail);
    return resultUpdate;
  },

  async changeEmailCancelRequest(userId: string) {
    const isUserExist = await UserRepository.getById({ userId });
    if (!isUserExist) throw new NotFound("user not found");

    const requestedEmailChange = await EmailChangeRequestRepository.findPendingByUserId(userId);
    if (!requestedEmailChange) throw new NotFound("Email change request not found");

    await EmailChangeRequestRepository.cancel(requestedEmailChange.id);
  },

  async changeEmailSendVerify(userId: string) {
    let otp = null;

    const redisSendOtpKey = `profile:change-email-otp-send|type:send|uid:${userId}`;
    const cfgLimiter = { key: redisSendOtpKey, limit: 3, windowSeconds: 60 * 30 };
    await RateLimiterService.fixedWindow(cfgLimiter);

    const isUserExist = await UserRepository.getById({ userId });
    if (!isUserExist) throw new NotFound("user not found");

    const accounts = await UserRepository.getAccountsByUserId(userId);
    const isOnlyCredentialsProvider = ProviderHelpers.isOnlyCredentialsProvider(accounts);

    if (!isOnlyCredentialsProvider) {
      throw new OperationNotAllowed("Email can only be changed for accounts with credentials provider");
    }

    const requestedEmailChange = await EmailChangeRequestRepository.findPendingByUserId(userId);
    if (!requestedEmailChange) throw new NotFound("Email change request not found");

    const { existingOtp } = await OtpRepository.getExistingOtp(redisSendOtpKey);
    if (existingOtp) await OtpRepository.deleteOtp(redisSendOtpKey);

    otp = OtpRepository.generateOtp(6);

    const cfg = { key: redisSendOtpKey, otp, ttlSeconds: 15 * 60 };
    await OtpRepository.storeOtp(cfg);

    const userData = await UserRepository.getById({ userId });
    if (!userData) throw new ResourceUnprocessableEntity("User not found");

    const verifyEmailArgs = { name: userData.name, email: requestedEmailChange.newEmail, otp };
    await EmailService.sendVerifyEmail(verifyEmailArgs);
  },

  async changeEmailVerify({ input, userId, vercelTlsFingerprint, sessionId }: ChangeEmailVerify) {
    const { otp: inputOtp } = input;

    const redisVerifyKey = `profile:change-email-otp-verify|type:verify|uid:${userId}`;
    const cfgLimiter = { key: redisVerifyKey, limit: 5, windowSeconds: 60 * 10 };
    await RateLimiterService.fixedWindow(cfgLimiter);

    const isUserExist = await UserRepository.getById({ userId });
    if (!isUserExist) throw new NotFound("user not found");

    const accounts = await UserRepository.getAccountsByUserId(userId);
    const isOnlyCredentialsProvider = ProviderHelpers.isOnlyCredentialsProvider(accounts);

    if (!isOnlyCredentialsProvider) {
      throw new OperationNotAllowed("Email can only be changed for accounts with credentials provider");
    }

    const requestedEmailChange = await EmailChangeRequestRepository.findPendingByUserId(userId);
    if (!requestedEmailChange) throw new NotFound("Email change request not found");

    const redisSendOtpKey = `profile:change-email-otp-send|type:send|uid:${userId}`;
    const { existingOtp } = await OtpRepository.getExistingOtp(redisSendOtpKey);

    if (!existingOtp) throw new ResourceUnprocessableEntity("OTP invalid or expired, please try again");
    const isSame = OtpRepository.isOtpSame(existingOtp, inputOtp);
    if (!isSame) throw new ResourceUnprocessableEntity("OTP invalid or expired, please try again");

    await prisma.$transaction(async (transaction) => {
      await EmailChangeRequestRepository.markVerified(requestedEmailChange.id, { transaction });
      await UserRepository.updateVerifiedAt({ userId, verifiedAt: new Date(), options: { transaction } });
      await UserRepository.updateEmail({ userId, email: requestedEmailChange.newEmail, options: { transaction } });
      await SessionRepository.revokeSessionsByUserId(userId, { transaction, exceptSessionId: sessionId });
    });

    await SessionRepository.revokeAllAccessTokenByUserIdRedis(userId, { exceptSessionId: sessionId });

    await OtpRepository.deleteOtp(redisVerifyKey);
    await OtpRepository.deleteOtp(redisSendOtpKey);

    const { newEmail, oldEmail, id: requestChangeEmailId } = requestedEmailChange;
    const revertEmailpayload = { email: oldEmail, requestChangeEmailId, newEmail, vercelTlsFingerprint, userId };
    await RevertAccountService.sendRevertAccountEmailChange(revertEmailpayload);
  },

  async changePassword({ input, userId, vercelTlsFingerprint, sessionId }: ChangePasswordProps) {
    const { confirmPassword, currentPassword } = input;

    const redisLimiterKey = `profile:change-password|uid:${userId}`;
    const cfgLimiter = { key: redisLimiterKey, limit: 5, windowSeconds: 60 * 15 };
    await RateLimiterService.fixedWindow(cfgLimiter);

    const user = await UserRepository.getById({ userId, options: { withPassword: true } });
    if (!user) throw new NotFound("user not found");

    if (!user.password) {
      throw new OperationNotAllowed("Password can only be changed for accounts with credentials provider");
    }

    const accounts = await UserRepository.getAccountsByUserId(userId);
    const isContainsCredentials = ProviderHelpers.isContainsCredentials(accounts);

    if (!isContainsCredentials) {
      throw new OperationNotAllowed("Password can only be changed for accounts with credentials provider");
    }

    const validCurrentPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validCurrentPassword) throw new AuthInvalidCredentials();

    const hashedNewPassword = await bcrypt.hash(confirmPassword, 10);

    await prisma.$transaction(async (transaction) => {
      await UserRepository.updatePassword({ userId, hashedPassword: hashedNewPassword, options: { transaction } });
      await SessionRepository.revokeSessionsByUserId(userId, { transaction, exceptSessionId: sessionId });
    });

    await SessionRepository.revokeAllAccessTokenByUserIdRedis(userId, { exceptSessionId: sessionId });
    await RevertAccountService.sendRevertAccountPasswordChange({ email: user.email, vercelTlsFingerprint });
  },
};
