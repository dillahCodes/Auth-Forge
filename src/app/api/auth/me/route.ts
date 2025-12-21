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

    // Get User
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true },
    });
    if (!user) return badRequest("User not found");

    return sendSuccess(user, "Logout successfully");
  } catch (error) {
    console.error("Logout Error:", error);
    return serverError(error);
  }
}
