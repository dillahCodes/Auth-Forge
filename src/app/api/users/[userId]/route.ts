import { AppError } from "@/errors/app-error";
import { ResourceNotFound, ResourceParamsInvalid } from "@/errors/resource-error";
import requiredAccessToken from "@/features/auth/guard/required-access-token";
import {
  errorResponse,
  internalServerError,
  sendSuccess,
} from "@/helper/response-helper";
import { prisma } from "@/lib/prisma";

type Params = RouteContext<"/api/users/[userId]">;

export async function GET(req: Request, { params }: Params) {
  try {
    await requiredAccessToken(req);

    // Validate Request
    const { userId } = await params;
    if (!userId) throw new ResourceParamsInvalid("parameter userId is required");

    // Get User
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true },
    });
    if (!user) throw new ResourceNotFound(`User With id ${userId} not found`);

    return sendSuccess(user, "Get user successfully");
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
