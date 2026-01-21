import { AppError } from "@/errors/app-error";
import { revokeSessionBySessionId } from "@/features/auth/database/logout-database";
import requiredRefreshToken from "@/features/auth/guard/required-refresh-token";
import { deleteSession } from "@/features/auth/lib/sessions";
import {
  errorResponse,
  internalServerError,
  sendSuccess,
} from "@/helper/response-helper";

export async function POST(req: Request) {
  try {
    const { sessionId } = await requiredRefreshToken(req);

    await revokeSessionBySessionId(sessionId);
    const response = sendSuccess(null, "Logout successfully");
    await deleteSession();

    return response;
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
