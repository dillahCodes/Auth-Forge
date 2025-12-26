import { AppError } from "@/errors/app-error";
import requiredAccessToken from "@/features/auth/guard/required-access-token";
import { sessionsMapping } from "@/features/auth/helper/sessions-helper";
import {
  errorResponse,
  internalServerError,
  sendSuccess,
} from "@/helper/response-helper";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { sessionId, userId } = await requiredAccessToken(req);

    const sessions = await prisma.sessions.findMany({
      where: { userId, revoked: false },
    });

    const mappedSessions = sessionsMapping(sessions, sessionId);

    const message = sessions.length
      ? "Get Sessions successfully"
      : "No active sessions found";
    return sendSuccess(mappedSessions, message);
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
