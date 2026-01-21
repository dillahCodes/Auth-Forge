import { AppError } from "@/errors/app-error";
import requiredAccessToken from "@/features/auth/guard/required-access-token";
import {
  errorResponse,
  internalServerError,
  sendSuccess,
} from "@/helper/response-helper";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    await requiredAccessToken(req);

    const result = await prisma.user.count();

    return sendSuccess(result, "Get users count successfully");
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
