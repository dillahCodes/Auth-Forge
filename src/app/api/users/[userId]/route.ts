import requiredAuth from "@/features/auth/guard/require-auth";
import {
  AppError,
  badRequest,
  errorResponse,
  internalServerError,
  sendSuccess,
} from "@/helper/response-helper";
import { prisma } from "@/lib/prisma";

type Params = RouteContext<"/api/users/[userId]">;

export async function GET(req: Request, { params }: Params) {
  try {
    await requiredAuth(req);

    // Validate Request
    const { userId } = await params;
    if (!userId) return badRequest("No user id found");

    // Get User
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });
    if (!user) return badRequest("User not found");

    return sendSuccess(user, "Get user successfully");
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
