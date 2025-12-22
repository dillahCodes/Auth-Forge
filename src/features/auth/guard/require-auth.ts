import { AuthError } from "@/helper/response-helper";
import { getClientInfo } from "@/lib/client-info";
import { prisma } from "@/lib/prisma";
import { getRevokedSession } from "../helper/login-helper";
import { decrypt, deleteSession, getCookie } from "../lib/sessions";

type requiredAuth = Promise<User & { sessionid: string  }>;

export default async function requiredAuth(req: Request): requiredAuth {
  const { ip, userAgent } = getClientInfo(req);

  // handle access token
  const accessToken = getCookie(req, "access_token");
  if (!accessToken) throw new AuthError("Unauthorized, please login first", 401);

  // validate access token (userId & sessionId)
  const payload = await decrypt(accessToken);
  if (!payload?.userId || typeof payload.userId !== "string") {
    throw new AuthError("Invalid token, please login first", 401);
  }

  if (!payload?.sessionId || typeof payload.sessionId !== "string") {
    throw new AuthError("Invalid token, please login first", 401);
  }

  // check revoked session
  const isRevoked = await getRevokedSession({ userId: payload.userId, ip, userAgent });
  if (isRevoked) {
    await deleteSession();
    throw new AuthError("Session revoked, please login again", 401);
  }

  // check user existence
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true },
  });

  if (!user) throw new AuthError("User not found", 404);

  return {
    id: user.id,
    sessionid: payload.sessionId,
    name: user.name as string,
    email: user.email,
  };
}
