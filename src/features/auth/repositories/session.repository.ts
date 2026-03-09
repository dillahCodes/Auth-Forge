import { prisma } from "@/shared/lib/prisma";
import { getRedis } from "@/shared/lib/redis/redis";
import { expiresInMiliseconds } from "@/shared/utils/expires-in-miliseconds";
import { Prisma } from "../../../../prisma/generated/client";
import { ACCESS_TOKEN_EXPIRES_SECONDS, REFRESH_TOKEN_EXPIRES_SECONDS } from "../services/token.service";

interface QueryOptions {
  transaction?: Prisma.TransactionClient;
}

interface CreateSessionParams {
  sessionId: string;
  userId: string;
  refreshToken: string;

  ip?: string | null;
  userAgent?: string | null;
  asn?: number | null;
  isp?: string | null;

  continent?: string | null;
  country?: string | null;
  countryRegion?: string | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

interface CreateAccessTokenParams {
  sessionId: string;
  userId: string;
  accessToken: string;
}

interface FindActiveSessionChainByUserIdOptions {
  startSessionId?: string;
}

interface RevokeByIdOptions {
  replacedBy?: string;
  transaction?: Prisma.TransactionClient;
}

interface RevokeSessionChainOptions {
  replacedBy?: string;
  transaction?: Prisma.TransactionClient;
}

interface RevokeSessionBySessionIdOptions {
  replacedBy?: string;
  exceptSessionId?: string;
  transaction?: Prisma.TransactionClient;
}

interface RevokeAccessTokensByUserIdRedisOptions {
  exceptSessionId?: string;
}

export const SessionRepository = {
  /* =======================
   * INSERT
   * ======================= */

  // DOC: store access token in redis database
  async storeAccessTokenRedis({ accessToken, sessionId, userId }: CreateAccessTokenParams) {
    const redis = await getRedis();

    await redis.set(`access_token:${sessionId}`, accessToken, {
      expiration: { type: "EX", value: ACCESS_TOKEN_EXPIRES_SECONDS },
    });

    await redis.sAdd(`user_access_tokens:${userId}`, sessionId);
  },

  // DOC: Create new user session
  storeSession(params: CreateSessionParams, options?: QueryOptions) {
    const db = options?.transaction ?? prisma;
    const expiresAt = expiresInMiliseconds(REFRESH_TOKEN_EXPIRES_SECONDS);

    return db.sessions.create({
      data: {
        id: params.sessionId,
        userId: params.userId,
        refreshToken: params.refreshToken,
        expiresAt,
        ipAddress: params.ip,
        userAgent: params.userAgent,
        asn: params.asn,
        isp: params.isp,
        continent: params.continent,
        country: params.country,
        countryRegion: params.countryRegion,
        city: params.city,
        latitude: params.latitude,
        longitude: params.longitude,
      },
    });
  },

  /* =======================
   * SELECT
   * ======================= */
  async getAccessTokenRedis(sessionId: string) {
    const redis = await getRedis();
    return redis.get(`access_token:${sessionId}`);
  },

  // DOC: Find session by session id
  findSessionById(sessionId: string) {
    return prisma.sessions.findUnique({ where: { id: sessionId } });
  },

  // DOC: Get active sessions by user id
  findActiveSessionsByUserId(userId: string) {
    return prisma.sessions.findMany({ where: { userId, revoked: false, replacedBy: null, deletedAt: null } });
  },

  // DOC: Get advanced session count by user id
  countSessionsByRevocationStatus(userId: string) {
    return prisma.sessions.groupBy({ by: ["revoked"], _count: true, where: { userId } });
  },

  // DOC: Find session chaining by user id
  findActiveSessionChainByUserId(userId: string, options?: FindActiveSessionChainByUserIdOptions) {
    const { startSessionId } = options ?? {};

    return prisma.sessions.findMany({
      where: { userId, deletedAt: null },
      select: { id: true, replacedBy: true },
      ...(startSessionId && { cursor: { id: startSessionId } }),
      orderBy: { createdAt: "asc" },
    });
  },

  /* =======================
   * UPDATE
   * ======================= */

  // DOC: Revoke session by id
  revokeSessionById(sessionId: string, options?: RevokeByIdOptions) {
    const { replacedBy, transaction } = options ?? {};
    const db = transaction ?? prisma;
    return db.sessions.update({ where: { id: sessionId }, data: { revoked: true, replacedBy: replacedBy ?? null } });
  },

  // DOC: Revoke all sessions chain by user id
  revokeSessionChain(sessionIds: string[], options?: RevokeSessionChainOptions) {
    const { replacedBy: replacedBySessionId, transaction } = options ?? {};
    const db = transaction ?? prisma;

    return db.sessions.updateMany({
      where: { id: { in: sessionIds } },
      data: { revoked: true, replacedBy: replacedBySessionId ?? null },
    });
  },

  // DOC: Revoke sessions by user id (optionally except one)
  revokeSessionsByUserId(userId: string, options?: RevokeSessionBySessionIdOptions) {
    const db = options?.transaction ?? prisma;

    return db.sessions.updateMany({
      where: {
        userId,
        revoked: false,
        ...(options?.exceptSessionId && {
          id: { not: options.exceptSessionId },
        }),
      },
      data: { revoked: true, replacedBy: options?.replacedBy ?? null },
    });
  },

  /* =======================
   * DELETE (SOFT)
   * ======================= */

  async revokeAccessTokensByUserIdRedis(userId: string, options?: RevokeAccessTokensByUserIdRedisOptions) {
    const { exceptSessionId } = options ?? {};

    const redis = await getRedis();
    const sessionIds = await redis.sMembers(`user_access_tokens:${userId}`);

    if (!sessionIds) return;
    const filteredSessionIds = exceptSessionId ? sessionIds.filter((id) => id !== exceptSessionId) : sessionIds;

    if (!filteredSessionIds.length) return;
    await redis.sRem(`user_access_tokens:${userId}`, filteredSessionIds);

    const filteredSessionIdKeys = filteredSessionIds.map((id) => `access_token:${id}`);
    await redis.del(filteredSessionIdKeys);
  },

  async revokeAccessTokenBySessionIds(sessionIds: string[], userId: string) {
    const redis = await getRedis();
    const mappedKeys = sessionIds.map((id) => `access_token:${id}`);

    await redis.del(mappedKeys);
    await redis.sRem(`user_access_tokens:${userId}`, sessionIds);
  },

  async revokeAccessTokenBySessionIdRedis(sessionId: string, userId: string) {
    const redis = await getRedis();
    await redis.del(`access_token:${sessionId}`);
    await redis.sRem(`user_access_tokens:${userId}`, sessionId);
  },

  // DOC: Soft Delete all sessions chain by user id
  softDeleteSessionChainByUserId(userId: string, options?: QueryOptions) {
    const db = options?.transaction ?? prisma;

    return db.sessions.updateMany({
      where: { userId, deletedAt: null },
      data: { deletedAt: new Date(), revoked: true },
    });
  },

  // DOC: Soft Delete all expired sessions
  softDeleteExpiredSessions() {
    return prisma.sessions.updateMany({
      where: { expiresAt: { lte: new Date() }, deletedAt: null, revoked: false },
      data: { deletedAt: new Date(), revoked: true },
    });
  },
};
