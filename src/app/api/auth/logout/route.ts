import { decrypt, deleteSession, getCookie } from "@/features/auth/lib/sessions";
import {
  badRequest,
  sendSuccess,
  serverError,
  unauthorized,
} from "@/helper/response-helper";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // Validate Request
    const refreshToken = getCookie(req, "refresh_token");
    if (!refreshToken) return badRequest("No refresh token found");

    // validate token signature
    const payload = await decrypt(refreshToken);
    if (!payload?.sessionId || typeof payload.sessionId !== "string") {
      return unauthorized("Invalid refresh token");
    }

    // validate token in database
    const isValidToken = await prisma.sessions.findFirst({
      where: { id: payload.sessionId, revoked: false },
    });

    if (!isValidToken) return unauthorized("Invalid refresh token");

    // Revoke refresh token
    await prisma.sessions.update({
      where: { id: payload.sessionId },
      data: { revoked: true },
    });

    // delete session Cookie on client
    const response = sendSuccess(null, "Logout successfully");
    await deleteSession();

    return response;
  } catch (error) {
    console.error("Logout Error:", error);
    return serverError(error);
  }
}
