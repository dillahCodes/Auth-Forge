import { AppError } from "@/errors/app-error";
import requiredAccessToken from "@/features/auth/guard/required-access-token";
import {
  errorResponse,
  internalServerError,
  sendSuccess,
} from "@/helper/response-helper";
import { prisma } from "@/lib/prisma";

type Params = RouteContext<"/api/auth/sessions/[sessionId]">;

export async function POST(req: Request, { params }: Params) {
  try {
    const { sessionId } = await params;
    await requiredAccessToken(req);

    // Revoke refresh token
    await prisma.sessions.update({
      where: { id: sessionId },
      data: { revoked: true },
    });

    return sendSuccess(null, "Revoke Session successfully");
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
