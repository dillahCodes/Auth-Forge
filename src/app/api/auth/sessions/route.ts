import requiredAuth from "@/features/auth/guard/require-auth";
import { sessionsMapping } from "@/features/auth/helper/sessions-helper";
import {
  AppError,
  badRequest,
  errorResponse,
  internalServerError,
  sendSuccess,
} from "@/helper/response-helper";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { sessionid, id: userId } = await requiredAuth(req);

    const sessions = await prisma.sessions.findMany({
      where: { userId, revoked: false },
    });
    if (!sessions.length) return badRequest("No active sessions found");

    const mappedSessions = sessionsMapping(sessions, sessionid);
    return sendSuccess(mappedSessions, "Get Sessions successfully");
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
