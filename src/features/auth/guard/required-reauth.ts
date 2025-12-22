import { AuthError } from "@/helper/response-helper";
import { decrypt, getCookie } from "../lib/sessions";
import { prisma } from "@/lib/prisma";

export default async function requiredReAuth(req: Request) {
  // handle refresh token
  const refreshToken = getCookie(req, "refresh_token");
  if (!refreshToken) throw new AuthError("Unauthorized, please login first", 401);

  // validate refresh token
  const refreshPayload = await decrypt(refreshToken);
  if (!refreshPayload?.sessionId || typeof refreshPayload.sessionId !== "string") {
    throw new AuthError("Invalid token, please login first", 401);
  }

  // check if refresh token is valid
  const refreshTokenQuery = await prisma.sessions.findFirst({
    where: { id: refreshPayload.sessionId, revoked: false },
  });
  if (!refreshTokenQuery) throw new AuthError("Invalid token, please login first", 401);

  return { sessionid: refreshTokenQuery.id };
}
