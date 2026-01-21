import { AppError } from "@/errors/app-error";
import { revokeAllSessionsByUserId } from "@/features/auth/database/sessions-database";
import requiredAccessToken from "@/features/auth/guard/required-access-token";
import { deleteSession } from "@/features/auth/lib/sessions";
import {
  errorResponse,
  internalServerError,
  sendSuccess,
} from "@/helper/response-helper";

export async function POST(req: Request) {
  try {
    const { userId } = await requiredAccessToken(req);

    await revokeAllSessionsByUserId(userId);
    await deleteSession();

    return sendSuccess(null, "Revoke All Sessions successfully");
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
