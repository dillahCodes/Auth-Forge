import { AppError } from "@/errors/app-error";
import requiredRefreshToken from "@/features/auth/guard/required-refresh-token";
import { createSession, setAuthCookies } from "@/features/auth/helper/login-helper";
import {
  deleteSession,
  signAccessToken,
  signRefreshToken,
} from "@/features/auth/lib/sessions";
import {
  errorResponse,
  internalServerError,
  sendSuccess,
} from "@/helper/response-helper";
import { getClientInfo } from "@/lib/client-info";
import { getClientLocation } from "@/lib/client-location";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    // get client info
    const { ip, userAgent } = getClientInfo(req);
    const location = getClientLocation(req);

    // validate refresh token
    const { sessionId, userId } = await requiredRefreshToken(req);

    // generate new token
    const newSessionId = uuidv4();
    const newAccessToken = await signAccessToken({ userId, sessionId: newSessionId });
    const newRefreshToken = await signRefreshToken({ sessionId: newSessionId });

    // token rotation
    await prisma.sessions.update({
      where: { id: sessionId },
      data: { revoked: true, replacedBy: newSessionId }, // token chaining
    });

    // create new session in database
    createSession({
      userId,
      sessionId: newSessionId,
      refreshToken: newRefreshToken,
      ip,
      userAgent,
      ...location,
    });

    const response = sendSuccess(null, "Refresh token successfully");
    setAuthCookies(response, newAccessToken, newRefreshToken);
    return response;
  } catch (error) {
    await deleteSession();
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
