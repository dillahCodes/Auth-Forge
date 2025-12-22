import requiredReAuth from "@/features/auth/guard/required-reauth";
import { deleteSession } from "@/features/auth/lib/sessions";
import {
  AppError,
  errorResponse,
  internalServerError,
  sendSuccess,
} from "@/helper/response-helper";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { sessionid } = await requiredReAuth(req);

    await prisma.sessions.update({ where: { id: sessionid }, data: { revoked: true } });
    const response = sendSuccess(null, "Logout successfully");
    await deleteSession();

    return response;
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
