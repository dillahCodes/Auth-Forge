import { AppError } from "@/errors/app-error";
import requiredRefreshToken from "@/features/auth/guard/required-refresh-token";
import { deleteSession } from "@/features/auth/lib/sessions";
import {
  errorResponse,
  internalServerError,
  sendSuccess,
} from "@/helper/response-helper";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { sessionId } = await requiredRefreshToken(req);

    await prisma.sessions.update({ where: { id: sessionId }, data: { revoked: true } });
    const response = sendSuccess(null, "Logout successfully");
    await deleteSession();

    return response;
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
