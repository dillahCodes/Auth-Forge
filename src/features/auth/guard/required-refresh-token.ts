import { AuthSessionRevoked, AuthUnauthorized } from "@/errors/auth-error";
import {
  deleteAllSessionByUserId,
  getSessionbySessionid,
} from "../database/sessions-database";
import {
  decrypt,
  deleteSession,
  getCookie,
  type RefreshTokenPayload,
} from "../lib/sessions";

type RequiredRefreshTokenResult = {
  sessionId: string;
  userId: string;
};

export default async function requiredRefreshToken(
  req: Request
): Promise<RequiredRefreshTokenResult> {
  const refreshToken = getCookie(req, "refresh_token");
  if (!refreshToken) throw new AuthUnauthorized();

  const result = await decrypt<RefreshTokenPayload>(refreshToken);
  if (!result.valid) {
    await deleteSession();
    throw new AuthUnauthorized();
  }

  const { sessionId } = result.payload;
  if (!sessionId) {
    await deleteSession();
    throw new AuthUnauthorized();
  }

  const session = await getSessionbySessionid(sessionId);
  if (!session) {
    await deleteSession();
    throw new AuthUnauthorized();
  }

  /**
   * REFRESH TOKEN REPLAY (FIRST ATTEMPT)
   * ------------------------------------
   * A refresh token is considered "replayed" when it refers to a session
   * that has already been revoked or replaced (i.e. by a newer token).
   *
   * This typically indicates that a stolen or outdated refresh token is
   * being used by an attacker after the legitimate user has already rotated
   * to a new session.
   *
   * DELETED vs NOT DELETED
   * - replay on non-deleted session  => first compromise event
   * - replay on deleted session      => subsequent retries (handled below)
   *
   * EXPECTED HANDLING:
   * - Revoke all active sessions for this user (compromise recovery)
   * - Clear local cookies
   * - Reject with "Session Revoked"
   */
  const isReplayAttack = (session.revoked || session.replacedBy) && !session.deletedAt;
  if (isReplayAttack) {
    await deleteAllSessionByUserId(session.userId);
    await deleteSession();
    throw new AuthSessionRevoked();
  }

  /**
   * REPLAY AFTER GLOBAL REVOCATION (SUBSEQUENT ATTEMPTS)
   * ----------------------------------------------------
   * After a compromise is detected, `deleteAllSessionByUserId()` marks all
   * sessions for this user with `deletedAt`, effectively terminating all active
   * refresh tokens.
   *
   * If the attacker continues replaying the stolen token after this point,
   * the token now resolves to a deleted session instead of a revoked one.
   *
   * In this state, the attacker can still send requests but cannot trigger
   * a second compromise recovery event, protecting the legitimate user's
   * experience from repeated global logouts.
   *
   * EXPECTED HANDLING:
   * - Clear local cookies
   * - Reject with Unauthorized (silent denial)
   */
  const isDeletedSession = session.deletedAt;
  if (isDeletedSession) {
    await deleteSession();
    throw new AuthUnauthorized();
  }

  return { sessionId: session.id, userId: session.userId };
}
