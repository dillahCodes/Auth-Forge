import { AuthInvalidCredentials, ValidationFailed } from "@/shared/errors/auth-error";
import { ClientInfo } from "@/shared/lib/client-info";
import { Geolocation } from "@/shared/lib/geolocation/geo-vercel";
import bcrypt from "bcrypt";
import "server-only";
import { v4 as uuidv4 } from "uuid";
import { SessionRepository } from "../repositories/session.repository";
import { UserRepository } from "../repositories/user.repositoriy";
import { LoginSchema } from "../schemas/login.schema";
import { RegisterSchema } from "../schemas/register.schema";
import { TokenService } from "./token.service";

interface LoginContext {
  geo: Geolocation;
  clientInfo: ClientInfo;
}

export const AuthService = {
  async login(input: LoginSchema, context: LoginContext) {
    const invalidCredentials = { email: ["Invalid email or password"], password: ["Invalid email or password"] };

    const user = await UserRepository.getByEmail(input.email, { withPassword: true });
    if (!user) throw new AuthInvalidCredentials(invalidCredentials);

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new AuthInvalidCredentials(invalidCredentials);

    const { signAccessToken, signRefreshToken } = TokenService;

    // DOC: create session and tokens
    const sessionId = uuidv4();
    const accessToken = await signAccessToken({ userId: user.id, sessionId, verifiedAt: user.verifiedAt });
    const refreshToken = await signRefreshToken({ sessionId });

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

    const user = await UserRepository.getByEmail(input.email);
    if (user) throw new ValidationFailed({ email: ["Email already exists"] });

    const hashedPassword = await bcrypt.hash(password, 10);
    const payload = { email, name, password: hashedPassword };
    const newUser = await UserRepository.create(payload);

    return newUser;
  },

  // DOC: handle logout flow
  async logout(sessionId: string) {
    const res = await SessionRepository.revokeSessionById(sessionId);
    await SessionRepository.revokeAccessTokenBySessionIdRedis(sessionId, res.userId);
    return res;
  },
};
