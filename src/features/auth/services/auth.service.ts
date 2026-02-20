import { AuthInvalidCredentials, ValidationFailed } from "@/shared/errors/auth-error";
import { ClientInfo } from "@/shared/lib/client-info";
import { Geolocation } from "@/shared/lib/geolocation/geo-vercel";
import bcrypt from "bcrypt";
import "server-only";
import { v4 as uuidv4 } from "uuid";
import { SessionRepository } from "../repositories/session.repository";
import { CreateUserPayload, UserRepository } from "../repositories/user.repositoriy";
import { LoginSchema } from "../schemas/login.schema";
import { RegisterSchema } from "../schemas/register.schema";
import { AccessTokenPayload, RefreshTokenPayload, TokenService } from "./token.service";
import { AuthProvider } from "../../../../prisma/generated/enums";

interface LoginContext {
  geo: Geolocation;
  clientInfo: ClientInfo;
}

type userDataPayload = CreateUserPayload["userData"];
type userAccountPayload = CreateUserPayload["userAccount"];

export const AuthService = {
  async login(input: LoginSchema, context: LoginContext) {
    const invalidCredentials = { email: ["Invalid email or password"], password: ["Invalid email or password"] };

    const user = await UserRepository.getByEmail({ email: input.email, options: { withPassword: true } });
    if (!user) throw new AuthInvalidCredentials(invalidCredentials);

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new AuthInvalidCredentials(invalidCredentials);

    const { signAccessToken, signRefreshToken } = TokenService;
    const { id: userId, verifiedAt } = user;
    const provider = AuthProvider.CREDENTIALS;

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

  // DOC: handle logout flow
  async logout(sessionId: string) {
    const res = await SessionRepository.revokeSessionById(sessionId);
    await SessionRepository.revokeAccessTokenBySessionIdRedis(sessionId, res.userId);
    return res;
  },
};
