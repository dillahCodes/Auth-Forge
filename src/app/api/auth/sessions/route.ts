import { sessionsMapping } from "@/features/auth/helper/sessions-helper";
import { decrypt, getCookie } from "@/features/auth/lib/sessions";
import {
  badRequest,
  sendSuccess,
  serverError,
  unauthorized,
} from "@/helper/response-helper";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // Validate Request
    const refreshToken = getCookie(req, "access_token");
    if (!refreshToken) return badRequest("No access token found");

    // validate token signature
    const payload = await decrypt(refreshToken);
    if (!payload?.userId || typeof payload.userId !== "string") {
      return unauthorized("Invalid refresh token");
    }

    const sessions = await prisma.sessions.findMany({
      where: { userId: payload.userId, revoked: false },
    });
    if (!sessions.length) return badRequest("No active sessions found");

    const mappedSessions = sessionsMapping(sessions, payload.sessionId as string);
    return sendSuccess(mappedSessions, "Get Sessions successfully");
  } catch (error) {
    console.error("Get Sessions Error:", error);
    return serverError(error);
  }
}
