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
import { UserData } from "../types/user";
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

interface ConnectBindUnbindParams {
  currentProvider: AuthProvider;
  input: ConnectCredentialsSchema;
  user: Pick<UserData, "id" | "verifiedAt" | "email" | "name">;
  provider: AuthProvider;
  sessionId: string;
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

  async bindCredentials({ input, provider, user, sessionId }: ConnectBindUnbindParams) {
    const { id: userId } = user;
    const { password, confirmPassword } = input;

    if (!password) throw new ValidationFailed({ password: ["Password is required"] });
    if (!confirmPassword) throw new ValidationFailed({ confirmPassword: ["Confirm Password is required"] });

    const hashedPassword = await bcrypt.hash(password, 10);
    const accountDataArgs = { provider, providerAccountId: user.id };

    await prisma.$transaction(async (transaction) => {
      await UserRepository.updatePassword({ userId: user.id, hashedPassword, options: { transaction } });
      await UserRepository.createAccount({ accountData: accountDataArgs, userId, options: { transaction } });
      await SessionRepository.revokeSessionsByUserId(user.id, { exceptSessionId: sessionId, transaction });
    });

    await SessionRepository.revokeAllAccessTokenByUserIdRedis(user.id, { exceptSessionId: sessionId });
  },

  async unbindCredentials({ provider, sessionId, user, currentProvider }: ConnectBindUnbindParams) {
    const accounts = await UserRepository.getAccountsByUserId(user.id);

    const credentialsProvider = ProviderHelpers.findCredentialsProvider(accounts);
    const isOnlyCredentialsProvider = ProviderHelpers.isOnlyCredentialsProvider(accounts);
    const isSameProvider = ProviderHelpers.isCurrentProviderSame(currentProvider, provider);

    if (!credentialsProvider) throw new NotFound("can't unbind, credentials provider not found");
    if (isOnlyCredentialsProvider) throw new OperationNotAllowed("can't unbind account with single provider");
    if (isSameProvider) throw new OperationNotAllowed("can't unbind account with same provider");

    await prisma.$transaction(async (transaction) => {
      await UserRepository.updatePassword({ userId: user.id, hashedPassword: null, options: { transaction } });
      await UserRepository.deleteAccount({ provider, providerAccountId: user.id, options: { transaction } });
      await SessionRepository.revokeSessionsByUserId(user.id, { exceptSessionId: sessionId, transaction });
    });

    await SessionRepository.revokeAllAccessTokenByUserIdRedis(user.id, { exceptSessionId: sessionId });
  },

  async connect({ input, userId, sessionId, currentProvider }: ConnectParams) {
    const user = await UserRepository.getById({ userId });
    if (!user) throw new NotFound("user not found");

    const provider = AuthProvider.CREDENTIALS;
    const providerAccountId = userId;
    const hasCredentials = await UserRepository.getUserByProvider({ provider, providerAccountId });

    hasCredentials
      ? await AuthCredentialsService.unbindCredentials({ user, provider, sessionId, input, currentProvider })
      : await AuthCredentialsService.bindCredentials({ user, provider, sessionId, input, currentProvider });
  },
};
