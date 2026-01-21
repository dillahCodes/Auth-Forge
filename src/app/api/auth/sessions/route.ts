import { AppError } from "@/errors/app-error";
import { getSessionsByUserId } from "@/features/auth/database/sessions-database";
import requiredAccessToken from "@/features/auth/guard/required-access-token";
import { sessionsMapping } from "@/features/auth/mapping/session-mapping";
import {
  errorResponse,
  internalServerError,
  sendSuccess,
} from "@/helper/response-helper";

export async function GET(req: Request) {
  try {
    const { sessionId, userId } = await requiredAccessToken(req);

    const sessions = await getSessionsByUserId(userId);
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
