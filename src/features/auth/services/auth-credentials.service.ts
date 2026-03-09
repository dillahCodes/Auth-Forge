import { AuthInvalidCredentials, ValidationFailed } from "@/shared/errors/auth-error";
import { NotFound, OperationNotAllowed } from "@/shared/errors/resource-error";
import { ClientInfo } from "@/shared/lib/client-info";
import { Geolocation } from "@/shared/lib/geolocation/geo-vercel";
import { prisma } from "@/shared/lib/prisma";
import { ProviderHelpers } from "@/shared/utils/providers-helper";
import bcrypt from "bcrypt";
import "server-only";
import { v4 as uuidv4 } from "uuid";
import { AuthProvider } from "../../../../prisma/generated/enums";
import { SessionRepository } from "../repositories/session.repository";
import { CreateUserPayload, UserRepository } from "../repositories/user.repositoriy";
import { ConnectCredentialsSchema, LoginSchema, RegisterSchema } from "../schemas/auth-credentials.schema";
import { UserAccount } from "../types/user";
import { AccessTokenPayload, RefreshTokenPayload, TokenService } from "./token.service";

interface LoginContext {
  geo: Geolocation;
  clientInfo: ClientInfo;
}

interface ConnectParams {
  currentProvider: AuthProvider;
  input: ConnectCredentialsSchema;
  userId: string;
  sessionId: string;
}

interface ConnectionParams {
  provider: AuthProvider;
  providerAccountId: string;
  currentProvider: AuthProvider;
  userAccounts: Omit<UserAccount, "isCurrentProvider">[];
  input: ConnectCredentialsSchema;
  sessionId: string;
  userId: string;
}

type userDataPayload = CreateUserPayload["userData"];
type userAccountPayload = CreateUserPayload["userAccount"];

export const AuthCredentialsService = {
  async login(input: LoginSchema, context: LoginContext) {
    const invalidCredentials = { email: ["Invalid email or password"], password: ["Invalid email or password"] };

    const user = await UserRepository.getByEmail({ email: input.email, options: { withPassword: true } });
    if (!user) throw new AuthInvalidCredentials(invalidCredentials);
    if (!user.password) throw new AuthInvalidCredentials(invalidCredentials);

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new AuthInvalidCredentials(invalidCredentials);

    const { signAccessToken, signRefreshToken } = TokenService;
    const { id: userId, verifiedAt } = user;
    const provider = AuthProvider.CREDENTIALS;
    const providerAccountId = userId;

    // DOC: if user login with credentials, check user have credentials account or not, if not create credentials account for user
    const hasCredentialsAccount = await UserRepository.getUserByProvider({ provider, providerAccountId });

    if (!hasCredentialsAccount) {
      const payloadAccount = { provider, providerAccountId: userId };
      await UserRepository.createAccount({ accountData: payloadAccount, userId });
    }

    // DOC: create session and tokens
    const sessionId = uuidv4();
    const accessTokenPayload: AccessTokenPayload = { userId, sessionId, verifiedAt, provider };
    const refreshTokenPayload: RefreshTokenPayload = { sessionId, provider };
    const accessToken = await signAccessToken(accessTokenPayload);
    const refreshToken = await signRefreshToken(refreshTokenPayload);

    // DOC: store refresh tokens in database
    const payloadRefreshToken = { sessionId, refreshToken, userId: user.id, ...context.clientInfo, ...context.geo };
    await SessionRepository.storeSession(payloadRefreshToken);

    // DOC: store access token in redis database
    const payloadAccessToken = { sessionId, accessToken, userId: user.id };
    await SessionRepository.storeAccessTokenRedis(payloadAccessToken);

    return {
      user: { id: user.id, email: user.email, name: user.name },
      tokens: { accessToken, refreshToken },
    };
  },

  async register(input: RegisterSchema) {
    const { email, name, password } = input;

    const user = await UserRepository.getByEmail({ email });
    if (user) throw new ValidationFailed({ email: ["Email already exists"] });

    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    const userDataPayload: userDataPayload = { email, name, password: hashedPassword, id: userId };
    const payloadAccount: userAccountPayload = { provider: AuthProvider.CREDENTIALS, providerAccountId: userId };
    const newUser = await UserRepository.create({ userData: userDataPayload, userAccount: payloadAccount });

    return newUser;
  },

  async logout(sessionId: string) {
    const res = await SessionRepository.revokeSessionById(sessionId);
    await SessionRepository.revokeAccessTokenBySessionIdRedis(sessionId, res.userId);
    return res;
  },

  async bindCredentials(params: ConnectionParams) {
    const { input, provider, providerAccountId, userId, sessionId, currentProvider, userAccounts } = params;
    const { password, confirmPassword } = input;

    const isSameProvider = ProviderHelpers.isCurrentProviderSame(currentProvider, provider);
    if (isSameProvider) throw new OperationNotAllowed("Cannot bind the currently active sign-in provider");

    const hasCredentialsAccount = ProviderHelpers.isContainsCredentials(userAccounts);
    if (hasCredentialsAccount) throw new OperationNotAllowed("Credentials account already linked");

    if (!password) throw new ValidationFailed({ password: ["Password is required"] });
    if (!confirmPassword) throw new ValidationFailed({ confirmPassword: ["Confirm Password is required"] });

    const hashedPassword = await bcrypt.hash(password, 10);
    const accountDataArgs = { provider, providerAccountId };

    await prisma.$transaction(async (transaction) => {
      await UserRepository.updatePassword({ userId, hashedPassword, options: { transaction } });
      await UserRepository.createAccount({ accountData: accountDataArgs, userId, options: { transaction } });
      await SessionRepository.revokeSessionsByUserId(userId, { exceptSessionId: sessionId, transaction });
    });

    await SessionRepository.revokeAccessTokensByUserIdRedis(userId, { exceptSessionId: sessionId });
    return "Connect credentials successfully";
  },

  async unbindCredentials(params: ConnectionParams) {
    const { provider, userId, sessionId, currentProvider, userAccounts, providerAccountId } = params;

    const hasCredentialsProvider = ProviderHelpers.findCredentialsProvider(userAccounts);
    if (!hasCredentialsProvider) throw new NotFound("can't unbind, credentials provider not found");

    const isOnlyCredentialsProvider = ProviderHelpers.isOnlyCredentialsProvider(userAccounts);
    if (isOnlyCredentialsProvider) throw new OperationNotAllowed("can't unbind account with single provider");

    const isSameProvider = ProviderHelpers.isCurrentProviderSame(currentProvider, provider);
    if (isSameProvider) throw new OperationNotAllowed("Cannot unbind the currently active sign-in provider");

    await prisma.$transaction(async (transaction) => {
      await UserRepository.updatePassword({ userId, hashedPassword: null, options: { transaction } });
      await UserRepository.deleteAccount({ provider, providerAccountId, options: { transaction } });
      await SessionRepository.revokeSessionsByUserId(userId, { exceptSessionId: sessionId, transaction });
    });

    await SessionRepository.revokeAccessTokensByUserIdRedis(userId, { exceptSessionId: sessionId });
    return "Unbind credentials successfully";
  },

  async connect({ input, userId, sessionId, currentProvider }: ConnectParams) {
    const user = await UserRepository.getById({ userId, options: { withAccounts: true } });
    if (!user) throw new NotFound("user not found");

    const provider = AuthProvider.CREDENTIALS;
    const hasCredentials = ProviderHelpers.findCredentialsProvider(user.accounts);

    const providerData = { provider, providerAccountId: user.id };
    const currentData = { currentProvider, sessionId };

    const userData = { userId: user.id, userAccounts: user.accounts };
    const connectionArgs: ConnectionParams = { input, ...providerData, ...currentData, ...userData };

    return hasCredentials
      ? await AuthCredentialsService.unbindCredentials(connectionArgs)
      : await AuthCredentialsService.bindCredentials(connectionArgs);
  },
};
