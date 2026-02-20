import { AuthSessionRevoked, AuthUnauthorized } from "@/shared/errors/auth-error";
import { ClientInfo } from "@/shared/lib/client-info";
import { Geolocation } from "@/shared/lib/geolocation/geo-vercel";
import { prisma } from "@/shared/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { SessionRepository } from "../repositories/session.repository";
import { UserRepository } from "../repositories/user.repositoriy";
import { AccessTokenPayload, RefreshTokenPayload, TokenService } from "./token.service";
import { AuthProvider } from "../../../../prisma/generated/enums";

interface RefreshTokenParams {
  clientInfo: ClientInfo;
  provider: AuthProvider;
  geolocation: Geolocation;
  sessionId: string;
  userId: string;
}

interface RevokeSessionBySessionIdPayload {
  sessionIdTobeRevoke: string;
  userId: string;
}

interface RevokeAllByUserIdOptions {
  exceptSessionId?: string;
}

type SessionId = string;
type ReplacedBy = string | null;
type SessionChainMap = Map<SessionId, ReplacedBy>;
type CurrentSessionIdToBeRevoke = string | null;

export const SessionService = {
  // DOC: validate session before access token
  async validateSessionForAccessToken(sessionId: string) {
    const result = await SessionRepository.getAccessTokenRedis(sessionId);
    if (!result) throw new AuthUnauthorized();
    return { sessionId, accessToken: result };
  },

  // DOC: validate session before refresh token
  async validateSessionForRefresh(sessionId: string) {
    const session = await SessionRepository.findSessionById(sessionId);
    if (!session) throw new AuthUnauthorized();

    const isReplayAttackAttempt = (session.revoked || session.replacedBy) && !session.deletedAt;

    // DOC: security decision, legit user and hacker will be force logout
    if (isReplayAttackAttempt) {
      await SessionRepository.softDeleteSessionChainByUserId(session.userId);
      await SessionRepository.revokeAllAccessTokenByUserIdRedis(session.userId);
      throw new AuthSessionRevoked();
    }

    const isManyReplayAttackAttempt = session.deletedAt;
    if (isManyReplayAttackAttempt) throw new AuthSessionRevoked();

    return session;
  },

  // DOC: refresh token if access token is expired
  async refreshToken(params: RefreshTokenParams) {
    const { clientInfo, geolocation, sessionId, userId, provider } = params;

    const user = await UserRepository.getById({ userId });
    if (!user) throw new AuthUnauthorized();

    const { verifiedAt } = user;

    // DOC: generate new token
    const newSessionId = uuidv4();
    const accessTokenPayload: AccessTokenPayload = { userId, sessionId: newSessionId, verifiedAt, provider };
    const refreshTokenPayload: RefreshTokenPayload = { sessionId: newSessionId, provider };

    const newAccessToken = await TokenService.signAccessToken(accessTokenPayload);
    const newRefreshToken = await TokenService.signRefreshToken(refreshTokenPayload);

    // DOC: create new refresh and access token payload
    const newAccessTokenPayload = { sessionId: newSessionId, accessToken: newAccessToken, userId };
    const newRefreshTokenPayload = { sessionId: newSessionId, refreshToken: newRefreshToken, userId };
    const newRefreshTokenWithInfoPayload = { ...clientInfo, ...geolocation, ...newRefreshTokenPayload };

    // DOC: token rotation and create new session
    await prisma.$transaction(async (transaction) => {
      await SessionRepository.revokeSessionById(sessionId, { replacedBy: newSessionId, transaction });
      await SessionRepository.storeSession(newRefreshTokenWithInfoPayload, { transaction });
    });

    // DOC: store new access token in redis and revoke old access token
    await SessionRepository.revokeAccessTokenBySessionIdRedis(sessionId, userId);
    await SessionRepository.storeAccessTokenRedis(newAccessTokenPayload);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  },

  // DOC: Get active sessions by user id
  async getActiveSessionsByUserId(userId: string) {
    const sessions = SessionRepository.findActiveSessionsByUserId(userId);
    return sessions;
  },

  // DOC: Get advanced session count by user id
  async countSessionsByRevocationStatus(userId: string) {
    const sessions = await SessionRepository.countSessionsByRevocationStatus(userId);
    return sessions;
  },

  // DOC: Revoke all sessions by user id
  async revokeAllByUserId(userId: string, options?: RevokeAllByUserIdOptions) {
    await SessionRepository.revokeSessionsByUserId(userId, options);
    await SessionRepository.revokeAllAccessTokenByUserIdRedis(userId, options);
  },

  // DOC: revoke session by session id
  async revokeSessionChainBySessionid(params: RevokeSessionBySessionIdPayload) {
    const { sessionIdTobeRevoke, userId } = params;

    const sessionFindOptions = { startSessionId: sessionIdTobeRevoke };
    const resultActiveSessionFind = await SessionRepository.findActiveSessionChainByUserId(userId, sessionFindOptions);

    // DOC: lookup map
    const sessionChainMap: SessionChainMap = new Map();
    for (const session of resultActiveSessionFind) sessionChainMap.set(session.id, session.replacedBy);

    // Doc: traverse forward, start from startSessionId
    let currentSessionIdToBeRevoke: CurrentSessionIdToBeRevoke = sessionIdTobeRevoke;
    const sessionsIdToBeRevoke: SessionId[] = [];

    // DOC: {sessionId, replacedBy}
    // Example: {A, B} => {B, C} => {C, D}
    while (currentSessionIdToBeRevoke) {
      sessionsIdToBeRevoke.push(currentSessionIdToBeRevoke);
      currentSessionIdToBeRevoke = sessionChainMap.get(currentSessionIdToBeRevoke) ?? null;
    }

    // DOC: revoke sessions and access token
    await SessionRepository.revokeAccessTokenBySessionIds(sessionsIdToBeRevoke, userId);
    await SessionRepository.revokeSessionChain(sessionsIdToBeRevoke);
  },
};
