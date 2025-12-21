import { decrypt, getCookie } from "@/features/auth/lib/sessions";
import {
  badRequest,
  sendSuccess,
  serverError,
  unauthorized,
} from "@/helper/response-helper";
import { prisma } from "@/lib/prisma";

type Params = RouteContext<"/api/auth/sessions/[sessionId]">;

export async function POST(req: Request, { params }: Params) {
  try {
    const { sessionId } = await params;

    // Validate Request
    const refreshToken = getCookie(req, "access_token");
    if (!refreshToken) return badRequest("No access token found");

    // validate token signature
    const payload = await decrypt(refreshToken);
    if (!payload?.userId || typeof payload.userId !== "string") {
      return unauthorized("Invalid refresh token");
    }

    // Revoke refresh token
    await prisma.sessions.update({
      where: { id: sessionId },
      data: { revoked: true },
    });

    return sendSuccess(null, "Revoke Session successfully");
  } catch (error) {
    console.error("Revoke Sessions Error:", error);
    return serverError(error);
  }
}
