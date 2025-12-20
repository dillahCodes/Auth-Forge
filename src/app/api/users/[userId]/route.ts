import { decrypt, getCookie } from "@/features/auth/lib/sessions";
import {
  badRequest,
  sendSuccess,
  serverError,
  unauthorized,
} from "@/helper/response-helper";
import { prisma } from "@/lib/prisma";

type Params = RouteContext<"/api/users/[userId]">;

export async function GET(req: Request, { params }: Params) {
  try {
    // Validate Request
    const { userId } = await params;
    if (!userId) return badRequest("No user id found");

    // Validate Token
    const accessToken = getCookie(req, "access_token");
    if (!accessToken) return badRequest("Missing access token in cookies");

    // Validate Token
    const payload = await decrypt(accessToken);
    if (!payload?.userId || typeof payload.userId !== "string") {
      return unauthorized("Invalid access token");
    }

    // Get User
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });
    if (!user) return badRequest("User not found");

    return sendSuccess(user, "Get user successfully");
  } catch (error) {
    console.error("Get User Error:", error);
    return serverError(error);
  }
}
