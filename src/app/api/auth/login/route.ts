import { AppError } from "@/errors/app-error";
import { createSession } from "@/features/auth/database/login-database";
import {
  setAuthCookies,
  signAccessToken,
  signRefreshToken,
} from "@/features/auth/lib/sessions";
import {
  validateCredentials,
  validateLoginForm,
} from "@/features/auth/validation/login-validation";
import {
  errorResponse,
  internalServerError,
  sendSuccess,
} from "@/helper/response-helper";
import { getClientInfo } from "@/lib/client-info";
import { geoVercel } from "@/lib/geolocation/geo-vercel";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    //DOC: validate input
    const parsed = await validateLoginForm(req);

    // DOC: credentials
    const { email, password } = parsed.data;

    //DOC: validate credentials
    const user = await validateCredentials(email, password);

    // DOC: get client info and geo location
    const clientInfo = getClientInfo(req);
    const geolocation = geoVercel(req, clientInfo.ip as string);

    // Doc: create session
    const sessionId = uuidv4();
    const accessToken = await signAccessToken({ userId: user.id, sessionId });
    const refreshToken = await signRefreshToken({ sessionId });

    await createSession({
      sessionId,
      userId: user.id,
      refreshToken,
      ...clientInfo,
      ...geolocation,
    });

    // const resultCreateSession = await createSession({
    //   sessionId,
    //   userId: user.id,
    //   refreshToken,
    //   ...clientInfo,
    //   ...formattedGeo,
    // });

    // const risk = await analyzeSessionRisk(resultCreateSession, user.id);
    // console.log("Session risk:", risk);

    // TODO: sebenarnya disini misalnya kritikal maka hacker harus verifikasi via email,
    // dan sebenarnya hacker belum boleh  diberikan akses token maupun refresh token

    // set cookies and response
    const userData = { id: user.id, email: user.email, name: user.name };
    const response = sendSuccess(userData, "Login successfully");
    setAuthCookies({ response, accessToken, refreshToken });

    return response;
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
