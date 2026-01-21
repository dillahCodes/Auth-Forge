import { AppError } from "@/errors/app-error";
import { revokeSessionBySessionId } from "@/features/auth/database/sessions-database";
import requiredAccessToken from "@/features/auth/guard/required-access-token";
import {
  errorResponse,
  internalServerError,
  sendSuccess,
} from "@/helper/response-helper";

type Params = RouteContext<"/api/auth/sessions/[sessionId]">;

export async function POST(req: Request, { params }: Params) {
  try {
    const { sessionId: sessionIdTobeRevoked } = await params;
    const { sessionId: currentSessionId, userId } = await requiredAccessToken(req);

    await revokeSessionBySessionId({
      startSessionId: sessionIdTobeRevoked,
      revokedBySessionId: currentSessionId,
      userId,
    });

    return sendSuccess(null, "Revoke Session successfully");
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
