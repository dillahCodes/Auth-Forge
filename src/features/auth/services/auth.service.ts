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
import { RateLimiterService } from "./rate-limit.service";
import { TokenService } from "./token.service";

interface LoginContext {
  geo: Geolocation;
  clientInfo: ClientInfo;
}

export const AuthService = {
  // DOC: Handle user login flow
  async login(input: LoginSchema, context: LoginContext) {
    const invalidCredentials = { email: ["Invalid email or password"], password: ["Invalid email or password"] };

    // DOC: Implement Rate Limit
    const redisLoginLimiterKey = `login|fg:${context.clientInfo.vercelTlsFingerprint}`;
    const cfgLimiter = { key: redisLoginLimiterKey, limit: 5, windowSeconds: 60 * 5 };
    await RateLimiterService.fixedWindow(cfgLimiter);

    // DOC: find user by email
    const user = await UserRepository.getByEmail(input.email, true);
    if (!user) throw new AuthInvalidCredentials(invalidCredentials);

    // DOC: validate password
    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new AuthInvalidCredentials(invalidCredentials);

    const { signAccessToken, signRefreshToken } = TokenService;

    // DOC: create session and tokens
    const sessionId = uuidv4();
    const accessToken = await signAccessToken({ userId: user.id, sessionId });
    const refreshToken = await signRefreshToken({ sessionId });

    // DOC: store session and tokens in database
    await SessionRepository.create({
      sessionId,
      userId: user.id,
      refreshToken,
      ...context.clientInfo,
      ...context.geo,
    });

    // DOC: delete login limiter
    RateLimiterService.clearLimiter(redisLoginLimiterKey);

    return {
      user: { id: user.id, email: user.email, name: user.name },
      tokens: { accessToken, refreshToken },
    };
  },

  // DOC: handle register flow
  async register(input: RegisterSchema, vercelTlsFingerprint: string | null) {
    // DOC: Implement Rate Limit
    const redisRegisterLimiterKey = `register|fg:${vercelTlsFingerprint}`;
    const cfgLimiter = { key: redisRegisterLimiterKey, limit: 5, windowSeconds: 60 * 5 };
    await RateLimiterService.fixedWindow(cfgLimiter);

    // DOC: check if email already exists
    const user = await UserRepository.getByEmail(input.email);
    if (user) throw new ValidationFailed({ email: ["Email already exists"] });

    // DOC: hash password
    const hashedPassword = await bcrypt.hash(input.password, 10);

    // DOC: create user
    const newUser = await UserRepository.create({ email: input.email, name: input.name, password: hashedPassword });
    return newUser;
  },

  // DOC: handle logout flow
  async logout(sessionId: string) {
    const res = await SessionRepository.revokeById(sessionId);
    return res;
  },
};
