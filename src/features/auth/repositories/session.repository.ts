import { prisma } from "@/shared/lib/prisma";
import { expiresInMiliseconds } from "@/shared/utils/expires-in-miliseconds";
import { REFRESH_TOKEN_EXPIRES_SECONDS } from "../services/token.service";
import { Prisma } from "../../../../prisma/generated/client";

export interface CreateSessionParams {
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

export const SessionRepository = {
  /* =======================
   * INSERT
   * ======================= */

  // DOC: Create new user session
  create(params: CreateSessionParams, transaction?: Prisma.TransactionClient) {
    const expiresAt = expiresInMiliseconds(REFRESH_TOKEN_EXPIRES_SECONDS);

    if (transaction)
      return transaction?.sessions.create({
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

    return prisma.sessions.create({
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

  // DOC: Find session by session id
  findById(sessionId: string) {
    return prisma.sessions.findUnique({
      where: { id: sessionId },
    });
  },

  // DOC: Get active sessions by user id
  findActiveSessionsByUserId(userId: string) {
    return prisma.sessions.findMany({
      where: { userId, revoked: false, replacedBy: null, deletedAt: null },
    });
  },

  // DOC: Get advanced session count by user id
  countSessionsByRevocationStatus(userId: string) {
    return prisma.sessions.groupBy({
      by: ["revoked"],
      _count: true,
      where: { userId },
    });
  },

  // DOC: Find session chaining by user id
  findActiveSessionChainByUserId(userId: string, startSessionId?: string) {
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
  revokeById(sessionId: string, replacedBy?: string | null, transaction?: Prisma.TransactionClient) {
    if (transaction) {
      return transaction.sessions.update({
        where: { id: sessionId },
        data: { revoked: true, replacedBy: replacedBy ?? null },
      });
    }

    return prisma.sessions.update({
      where: { id: sessionId },
      data: { revoked: true, replacedBy: replacedBy ?? null },
    });
  },

  // DOC: Revoke all sessions chain by user id
  revokeSessionChain(
    sessionIds: string[],
    replacedBySessionId?: string | null,
    transaction?: Prisma.TransactionClient
  ) {
    if (transaction)
      return transaction.sessions.updateMany({
        where: { id: { in: sessionIds } },
        data: { revoked: true, replacedBy: replacedBySessionId ?? null },
      });

    return prisma.sessions.updateMany({
      where: { id: { in: sessionIds } },
      data: { revoked: true, replacedBy: replacedBySessionId ?? null },
    });
  },

  // DOC: Revoke sessions by user id (optionally except one)
  revokeSessionsByUserId(userId: string, options?: { exceptSessionId?: string; replacedBy?: string | null }) {
    return prisma.sessions.updateMany({
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

  // DOC: Soft Delete all sessions chain by user id
  softDeleteSessionChainByUserId(userId: string, transaction?: Prisma.TransactionClient) {
    if (transaction)
      return transaction.sessions.updateMany({
        where: { userId, revoked: false, deletedAt: null },
        data: { deletedAt: new Date(), revoked: true },
      });

    return prisma.sessions.updateMany({
      where: { userId, revoked: false, deletedAt: null },
      data: { deletedAt: new Date(), revoked: true },
    });
  },
};
