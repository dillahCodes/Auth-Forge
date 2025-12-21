import { decrypt, getCookie } from "@/features/auth/lib/sessions";
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
    const refreshToken = getCookie(req, "access_token");
    if (!refreshToken) return badRequest("No access token found");

    // validate token signature
    const payload = await decrypt(refreshToken);
    if (!payload?.userId || typeof payload.userId !== "string") {
      return unauthorized("Invalid refresh token");
    }

    // Revoke refresh token
    await prisma.sessions.updateMany({
      where: { userId: payload.userId },
      data: { revoked: true },
    });

    return sendSuccess(null, "Revoke All Sessions successfully");
  } catch (error) {
    console.error("Revoke All Sessions Error:", error);
    return serverError(error);
  }
}
