import { AppError } from "@/errors/app-error";
import requiredAccessToken from "@/features/auth/guard/required-access-token";
import { deleteSession } from "@/features/auth/lib/sessions";
import {
  errorResponse,
  internalServerError,
  sendSuccess,
} from "@/helper/response-helper";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await requiredAccessToken(req);

    await prisma.sessions.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });

    await deleteSession();

    return sendSuccess(null, "Revoke All Sessions successfully");
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
