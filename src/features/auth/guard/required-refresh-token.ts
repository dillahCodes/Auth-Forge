import { AuthSessionRevoked, AuthUnauthorized } from "@/errors/auth-error";
import { prisma } from "@/lib/prisma";
import { decrypt, getCookie, type RefreshTokenPayload } from "../lib/sessions";

type RequiredRefreshTokenResult = {
  sessionId: string;
  userId: string;
};

export default async function requiredRefreshToken(
  req: Request
): Promise<RequiredRefreshTokenResult> {
  // check if the refresh token is present
  const refreshToken = getCookie(req, "refresh_token");
  if (!refreshToken) throw new AuthUnauthorized();

  // check if the refresh token is valid
  const result = await decrypt<RefreshTokenPayload>(refreshToken);
  if (!result.valid) throw new AuthUnauthorized();

  // check if the sessionId is valid
  const { sessionId } = result.payload;
  if (!sessionId) throw new AuthUnauthorized();

  // Find the session in the database
  const session = await prisma.sessions.findFirst({
    where: { id: sessionId, revoked: false },
    select: { id: true, userId: true },
  });

  if (!session) throw new AuthSessionRevoked();

  return { sessionId: session.id, userId: session.userId };
}
