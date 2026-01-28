import { AuthSessionRevoked, AuthUnauthorized } from "@/shared/errors/auth-error";
import { ClientInfo } from "@/shared/lib/client-info";
import { Geolocation } from "@/shared/lib/geolocation/geo-vercel";
import { prisma } from "@/shared/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { SessionRepository } from "../repositories/session.repository";
import { TokenService } from "./token.service";

interface RefreshTokenPayload {
  clientInfo: ClientInfo;
  geolocation: Geolocation;
  sessionId: string;
  userId: string;
}

interface RevokeSessionBySessionIdPayload {
  sessionIdTobeRevoke: string;
  userId: string;
}

type SessionId = string;
type ReplacedBy = string | null;
type SessionChainMap = Map<SessionId, ReplacedBy>;
type CurrentSessionIdToBeRevoke = string | null;

export const SessionService = {
  // DOC: validate session before refresh token
  async validateSessionForRefresh(sessionId: string) {
    const session = await SessionRepository.findById(sessionId);
    if (!session) throw new AuthUnauthorized();

    const isReplayAttackAttempt = (session.revoked || session.replacedBy) && !session.deletedAt;

    // DOC: security decision, legit user and hacker will be force logout
    if (isReplayAttackAttempt) {
      await SessionRepository.softDeleteSessionChainByUserId(session.userId);
      throw new AuthSessionRevoked();
    }

    const isManyReplayAttackAttempt = session.deletedAt;
    if (isManyReplayAttackAttempt) throw new AuthSessionRevoked();

    return session;
  },

  // DOC: refresh token if access token is expired
  async refreshToken(params: RefreshTokenPayload) {
    const { clientInfo, geolocation, sessionId, userId } = params;

    // DOC: generate new token
    const newSessionId = uuidv4();
    const newAccessToken = await TokenService.signAccessToken({ userId, sessionId: newSessionId });
    const newRefreshToken = await TokenService.signRefreshToken({ sessionId: newSessionId });
    const newTokenPayload = { sessionId: newSessionId, refreshToken: newRefreshToken };

    // DOC: token rotation and create new session
    await prisma.$transaction(async (transaction) => {
      await SessionRepository.revokeById(sessionId, newSessionId, transaction);
      await SessionRepository.create({ userId, ...newTokenPayload, ...clientInfo, ...geolocation }, transaction);
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
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
  async revokeAllByUserId(userId: string, options?: { exceptSessionId?: string }) {
    await SessionRepository.revokeSessionsByUserId(userId, options);
  },

  // DOC: revoke session by session id
  async revokeSessionChainBySessionid(params: RevokeSessionBySessionIdPayload) {
    const { sessionIdTobeRevoke, userId } = params;

    const resultActiveSessionFind = await SessionRepository.findActiveSessionChainByUserId(userId, sessionIdTobeRevoke);

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

    await SessionRepository.revokeSessionChain(sessionsIdToBeRevoke);
  },
};
