import { AppError } from "@/errors/app-error";
import { ResourceNotFound } from "@/errors/resource-error";
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
import { prisma } from "@/lib/prisma";
import { formatGeoLocation, whoisGeoLocation } from "@/lib/whois";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    // validate refresh token
    const { sessionId, userId } = await requiredRefreshToken(req);

    // get client info and geo location
    const clientInfo = getClientInfo(req);
    const geo = await whoisGeoLocation(clientInfo.ip);
    const formattedGeo = formatGeoLocation(geo);

    if (!formattedGeo) {
      throw new ResourceNotFound("Geo location not found", {
        email: ["geo location not found"],
        password: ["geo location not found"],
      });
    }

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
    await createSession({
      userId,
      sessionId: newSessionId,
      refreshToken: newRefreshToken,
      ...clientInfo,
      ...formattedGeo,
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
    setAuthCookies(response, newAccessToken, newRefreshToken);

    return response;
  } catch (error) {
    await deleteSession();
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
