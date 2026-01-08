import { AuthSessionRevoked, AuthUnauthorized } from "@/errors/auth-error";
import {
  deleteAllSessionByUserId,
  getSessionbySessionid,
} from "../helper/sessions-helper";
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
  if (!result.valid) throw new AuthUnauthorized();

  const { sessionId } = result.payload;
  if (!sessionId) throw new AuthUnauthorized();

  const session = await getSessionbySessionid(sessionId);
  if (!session) throw new AuthUnauthorized();

  const isReuseTokenAttempt = session.revoked || session.replacedBy;
  if (isReuseTokenAttempt) {
    await deleteAllSessionByUserId(session.userId);
    await deleteSession();
    throw new AuthSessionRevoked();
  }

  return { sessionId: session.id, userId: session.userId };
}
