import requiredAuth from "@/features/auth/guard/require-auth";
import {
  AppError,
  errorResponse,
  internalServerError,
  sendSuccess,
} from "@/helper/response-helper";

export async function GET(req: Request) {
  try {
    const user = await requiredAuth(req);
    return sendSuccess(user, "Get my user data successfully");
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
