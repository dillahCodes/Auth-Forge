import { AppError } from "@/errors/app-error";
import { createSession } from "@/features/auth/database/login-database";
import requiredRefreshToken from "@/features/auth/guard/required-refresh-token";
import {
  deleteSession,
  setAuthCookies,
  signAccessToken,
  signRefreshToken,
} from "@/features/auth/lib/sessions";
import {
  errorResponse,
  internalServerError,
  sendSuccess,
} from "@/helper/response-helper";
import { getClientInfo } from "@/lib/client-info";
import { geoVercel } from "@/lib/geolocation/geo-vercel";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    // validate refresh token
    const { sessionId, userId } = await requiredRefreshToken(req);

    // DOC: get client info and geo location
    const clientInfo = getClientInfo(req);
    const geolocation = geoVercel(req, clientInfo.ip as string);

    // DOC: generate new token
    const newSessionId = uuidv4();
    const newAccessToken = await signAccessToken({ userId, sessionId: newSessionId });
    const newRefreshToken = await signRefreshToken({ sessionId: newSessionId });

    // DOC: token rotation
    await prisma.sessions.update({
      where: { id: sessionId },
      data: { revoked: true, replacedBy: newSessionId }, // token chaining
    });

    // create new session in database
    await createSession({
      userId,
      sessionId: newSessionId,
      refreshToken: newRefreshToken,
      ...clientInfo,
      ...geolocation,
    });

    // const resultCreateSession = await createSession({
    //   userId,
    //   sessionId: newSessionId,
    //   refreshToken: newRefreshToken,
    //   ...clientInfo,
    //   ...formattedGeo,
    // });

    // const risk = await analyzeSessionRisk(resultCreateSession, userId);
    // console.log("Session risk:", risk);

    // TODO: sebenarnya disini misalnya kritikal maka hacker harus verifikasi via email,
    // dan sebenarnya hacker belum boleh diberikan akses token maupun refresh token

    // set cookies and response
    const response = sendSuccess(null, "Refresh token successfully");
    setAuthCookies({
      response,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

    return response;
  } catch (error) {
    await deleteSession();
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
