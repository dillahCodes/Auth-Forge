import { AuthUnauthorized } from "@/shared/errors/auth-error";
import { ClientInfo } from "@/shared/lib/client-info";
import { Geolocation } from "@/shared/lib/geolocation/geo-vercel";
import { googleClient } from "@/shared/lib/oauth/google.oauth";
import { prisma } from "@/shared/lib/prisma";
import { createUrlParams } from "@/shared/utils/create-url-params";
import { ProviderHelpers } from "@/shared/utils/providers-helper";
import { Credentials, GenerateAuthUrlOpts } from "google-auth-library";
import { v4 as uuidv4 } from "uuid";
import { AuthProvider } from "../../../../prisma/generated/enums";
import { SessionRepository } from "../repositories/session.repository";
import { UserRepository } from "../repositories/user.repositoriy";
import { UserAccount, UserData } from "../types/user";
import { AccessTokenPayload, RefreshTokenPayload, TokenService } from "./token.service";

interface CallbackParams {
  code: string;
  geo: Geolocation;
  clientInfo: ClientInfo;
}

type CallbackConnectionParams = Pick<CallbackParams, "code"> & {
  currentProvider: AuthProvider;
  currentUserId: string;
  currentSessionId: string;
};

interface GenerateTokenByGoogleAuthParams {
  googleTokens: Credentials;
  user: Pick<UserData, "id" | "verifiedAt" | "email">;
  geo: Geolocation;
  clientInfo: ClientInfo;
}

interface HandleNewUserParams {
  email?: string;
  name?: string;
  isEmailVerified?: boolean;
  providerAccountId: string;
}

export interface GenerateoAuthUrlConfigParams {
  redirectAfterAuthTo?: string;
  forEndpoint: "AUTH" | "CONNECT";
}

interface ConnectionParams {
  userId: string;
  userAccounts: Omit<UserAccount, "isCurrentProvider">[];
  provider: AuthProvider;
  providerAccountId: string;
  currentProvider: AuthProvider;
  currentSessionId: string;
}

export const AuthGoogleService = {
  generateoAuthUrlConfig: ({ redirectAfterAuthTo, forEndpoint }: GenerateoAuthUrlConfigParams): GenerateAuthUrlOpts => {
    const state = redirectAfterAuthTo ? JSON.stringify({ redirectTo: redirectAfterAuthTo }) : undefined;

    const isAuth = forEndpoint === "AUTH";
    const redirect_uri = isAuth ? process.env.GOOGLE_REDIRECT_URI : process.env.GOOGLE_REDIRECT_URI_CONNECT;

    const scope = [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      // "https://www.googleapis.com/auth/photoslibrary.readonly",
      // "https://www.googleapis.com/auth/drive.readonly",
    ];

    const config: GenerateAuthUrlOpts = { access_type: "offline", prompt: "consent", scope, state, redirect_uri };
    return config;
  },

  async verifyGoogleTokens(idToken: string) {
    const verifyIdTokenArgs = { idToken, audience: process.env.GOOGLE_CLIENT_ID };
    const ticket = await googleClient.verifyIdToken(verifyIdTokenArgs);
    const tokenPayload = ticket.getPayload();

    if (!tokenPayload) throw new AuthUnauthorized("Invalid Google authentication token");
    return tokenPayload;
  },

  async createNewUser({ email, name, isEmailVerified, providerAccountId }: HandleNewUserParams) {
    const userId = uuidv4();

    const emailString = email as string;
    const nameString = name as string;
    const userCredentials = { email: emailString, name: nameString, password: null, id: userId };

    const userDataPayload = { ...userCredentials, verifiedAt: isEmailVerified ? new Date() : null };
    const payloadAccount = { provider: AuthProvider.GOOGLE, providerAccountId };
    const userResult = await UserRepository.create({ userData: userDataPayload, userAccount: payloadAccount });

    return userResult;
  },

  async generateAuthToken({ user, geo, clientInfo, googleTokens }: GenerateTokenByGoogleAuthParams) {
    const { verifiedAt, id: userId } = user;

    // DOC: create session and tokens
    const sessionId = uuidv4();
    const accessTokenPayload: AccessTokenPayload = { userId, sessionId, verifiedAt, provider: AuthProvider.GOOGLE };
    const refreshTokenPayload: RefreshTokenPayload = { sessionId, provider: AuthProvider.GOOGLE };

    const { signAccessToken, signRefreshToken } = TokenService;
    const accessToken = await signAccessToken(accessTokenPayload);
    const refreshToken = await signRefreshToken(refreshTokenPayload);

    const argsRefreshToken = { sessionId, refreshToken, userId, ...clientInfo, ...geo };
    await SessionRepository.storeSession(argsRefreshToken);

    const argsdAccessToken = { sessionId, accessToken, userId };
    await SessionRepository.storeAccessTokenRedis(argsdAccessToken);

    return { accessToken, refreshToken, googleTokens };
  },

  async unbindGoogleAccount(params: ConnectionParams) {
    const { provider, providerAccountId, userId, currentProvider, currentSessionId, userAccounts } = params;

    const googleProvider = ProviderHelpers.findGoogleProvider(userAccounts);
    if (!googleProvider) return createUrlParams({ ErrorMessage: "missing google provider" });
    const { provider: googleProviderName, providerAccountId: googleProviderAccountId } = googleProvider;

    const targetTobeUnbind = { targetProvider: googleProviderName, targetProviderAccountId: googleProviderAccountId };
    const incomingTobeUnbind = { provider, providerAccountId };
    const isMatchedAccount = ProviderHelpers.isMatchedProvider({ ...incomingTobeUnbind, ...targetTobeUnbind });

    if (!isMatchedAccount) {
      return createUrlParams({ ErrorMessage: "This Google account does not match your linked account." });
    }

    const isOnlyGoogleProvider = ProviderHelpers.isOnlyGoogleProvider(userAccounts);
    if (isOnlyGoogleProvider) return createUrlParams({ ErrorMessage: "can't unbind account with single provider" });

    const isSameProvider = ProviderHelpers.isCurrentProviderSame(currentProvider, provider);
    if (isSameProvider) return createUrlParams({ ErrorMessage: "Cannot unbind the currently active sign-in provider" });

    await prisma.$transaction(async (transaction) => {
      await UserRepository.deleteAccount({ ...incomingTobeUnbind, options: { transaction } });
      await SessionRepository.revokeSessionsByUserId(userId, { exceptSessionId: currentSessionId, transaction });
    });

    await SessionRepository.revokeAccessTokensByUserIdRedis(userId, { exceptSessionId: currentSessionId });
    return createUrlParams({ SuccessMessage: "unbind Google account successfully" });
  },

  async bindGoogleAccount(params: ConnectionParams) {
    const { provider, providerAccountId, userId, currentSessionId, currentProvider, userAccounts } = params;

    const isContainGoogleProvider = ProviderHelpers.isContainGoogle(userAccounts);
    if (isContainGoogleProvider) return createUrlParams({ ErrorMessage: "Google account already linked" });

    const isSameProvider = ProviderHelpers.isCurrentProviderSame(currentProvider, provider);
    if (isSameProvider) return createUrlParams({ ErrorMessage: "Cannot bind the currently active sign-in provider" });

    const argsAccountData = { provider, providerAccountId };

    await prisma.$transaction(async (transaction) => {
      await UserRepository.createAccount({ userId, accountData: argsAccountData, options: { transaction } });
      await SessionRepository.revokeSessionsByUserId(userId, { exceptSessionId: currentSessionId, transaction });
    });

    await SessionRepository.revokeAccessTokensByUserIdRedis(userId, { exceptSessionId: currentSessionId });
    return createUrlParams({ SuccessMessage: "bind Google account successfully" });
  },

  // DOC: https://www.npmjs.com/package/google-auth-library
  async callbackAuth({ code, geo, clientInfo }: CallbackParams) {
    const { verifyGoogleTokens, generateAuthToken, createNewUser } = AuthGoogleService;
    const { tokens } = await googleClient.getToken({ code, redirect_uri: process.env.GOOGLE_REDIRECT_URI });

    const tokenPayload = await verifyGoogleTokens(tokens.id_token as string);
    const { email, name, sub, email_verified } = tokenPayload;

    const provider = AuthProvider.GOOGLE;

    // DOC: handle existing account (login)
    const existingGoogleAccount = await UserRepository.getUserByProvider({ provider, providerAccountId: sub });

    if (existingGoogleAccount) {
      const args = { user: existingGoogleAccount.user, geo, clientInfo, googleTokens: tokens };
      return await generateAuthToken(args);
    }

    // DOC: handle existing account (register)
    const getByEmailArgs = { email: email as string, options: { withAccounts: true } };
    const existingUser = await UserRepository.getByEmail(getByEmailArgs);

    if (existingUser) {
      const { id: userId } = existingUser;
      const hasGoogle = ProviderHelpers.findGoogleProvider(existingUser.accounts);

      const argsGenerateToken = { user: existingUser, geo, clientInfo, googleTokens: tokens };
      const argsAccountData = { provider, providerAccountId: sub };

      if (!hasGoogle) await UserRepository.createAccount({ userId, accountData: argsAccountData });
      return await generateAuthToken(argsGenerateToken);
    }

    // DOC: handle new account
    const newUserArgs = { email, name, isEmailVerified: email_verified, providerAccountId: sub };
    const newUser = await createNewUser(newUserArgs);

    return await generateAuthToken({ user: newUser, geo, clientInfo, googleTokens: tokens });
  },

  // DOC: handle bind and unbind account
  async connectionCallback({ code, currentProvider, currentUserId, currentSessionId }: CallbackConnectionParams) {
    const { verifyGoogleTokens, unbindGoogleAccount, bindGoogleAccount } = AuthGoogleService;
    const { tokens } = await googleClient.getToken({ code, redirect_uri: process.env.GOOGLE_REDIRECT_URI_CONNECT });

    const tokenPayload = await verifyGoogleTokens(tokens.id_token as string);
    const { sub } = tokenPayload;
    const provider = AuthProvider.GOOGLE;

    const userData = await UserRepository.getById({ userId: currentUserId, options: { withAccounts: true } });
    if (!userData) return createUrlParams({ ErrorMessage: "User not found" });

    const userAccounts = userData.accounts;
    const providerData = { provider, providerAccountId: sub };
    const currentData = { currentProvider, userId: currentUserId, currentSessionId };

    const connectionArgs = { ...currentData, ...providerData, userAccounts };
    const isConnected = ProviderHelpers.findGoogleProvider(userAccounts);
    return isConnected ? await unbindGoogleAccount(connectionArgs) : await bindGoogleAccount(connectionArgs);
  },
};
