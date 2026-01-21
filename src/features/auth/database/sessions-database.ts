import { prisma } from "@/lib/prisma";
import "server-only";

export const getSessionbySessionid = async (sessionId: string) => {
  const session = await prisma.sessions.findUnique({
    where: { id: sessionId },
    select: { id: true, userId: true, revoked: true, replacedBy: true, deletedAt: true },
  });
  return session;
};

export const deleteAllSessionByUserId = async (userId: string) => {
  await prisma.sessions.updateMany({
    where: { userId },
    data: { revoked: true, deletedAt: new Date() },
  });
};

export const getNotDeletedSessionsByUserId = async (
  userId: string,
  startSessionId?: string
) => {
  const sessions = await prisma.sessions.findMany({
    where: { userId, deletedAt: null },
    select: { id: true, replacedBy: true },
    ...(startSessionId && { cursor: { id: startSessionId } }),
    orderBy: { createdAt: "asc" },
  });
  return sessions;
};

export const getSessionsByUserId = async (userId: string) => {
  const sessions = await prisma.sessions.findMany({
    where: { userId, revoked: false, replacedBy: null, deletedAt: null },
  });
  return sessions;
};

export const getUserBySessionId = async (sessionId: string) => {
  const session = await prisma.sessions.findUnique({
    where: { id: sessionId },
    select: { user: { select: { name: true, email: true, verifiedAt: true } } },
  });
  return session?.user;
};

interface RevokeSessionBySessionId {
  userId: string;
  revokedBySessionId: string;
  startSessionId: string;
}

/**
 * REVOKE INDIVIDUAL SESSION (TOKEN ROTATION CONTEXT)
 * --------------------------------------------------
 * Explicitly revokes a single session. `replacedBy` links the revoked session
 * to the currently active session, enabling rotation-based replay detection.
 *
 * Example scenario:
 * - Session A is older
 * - Session B is new
 * - A replacedBy = B
 *
 * If token from session A is replayed later, the server can distinguish the
 * event as a compromise attempt, since B is now the legitimate session.
 *
 * NOTE:
 * No deletion here — deletion happens only during compromise recovery.
 */
export const revokeSessionBySessionId = async ({
  revokedBySessionId,
  startSessionId,
  userId,
}: RevokeSessionBySessionId) => {
  // DOC: fetch all users sessions
  const resultUserSessions = await getNotDeletedSessionsByUserId(userId, startSessionId);

  // DOC: lookup map
  const sessionsMap = new Map<string, string | null>();
  for (const session of resultUserSessions) {
    sessionsMap.set(session.id, session.replacedBy);
  }

  // Doc: traverse forward, start from startSessionId
  let currentSessionId: string | null = startSessionId;
  const resultRevokedBySessionIdChain: string[] = [];

  while (currentSessionId) {
    resultRevokedBySessionIdChain.push(currentSessionId);
    currentSessionId = sessionsMap.get(currentSessionId) ?? null;
  }

  // DOC: update all sessions chaining
  await prisma.sessions.updateMany({
    where: { id: { in: resultRevokedBySessionIdChain } },
    data: { revoked: true, replacedBy: revokedBySessionId },
  });
};

/**
 * REVOKE ALL ACTIVE SESSIONS (COMPROMISE RECOVERY)
 * ------------------------------------------------
 * Marks all currently active sessions as revoked for this user. This is
 * triggered either manually (user action) or automatically when a refresh
 * token replay is detected.
 *
 * This step terminates any outstanding refresh tokens but does not mark
 * `deletedAt` yet. Deletion is performed later in the refresh flow so that
 * subsequent replay attempts are silently denied instead of repeatedly
 * triggering global logout behavior.
 */
export const revokeAllSessionsByUserId = async (userId: string) => {
  await prisma.sessions.updateMany({
    where: { userId, revoked: false },
    data: { revoked: true },
  });
};
