import { AppError } from "@/errors/app-error";
import { AuthInvalidCredentials } from "@/errors/auth-error";
import { ResourceNotFound } from "@/errors/resource-error";
import {
  createSession,
  setAuthCookies,
  validateLoginForm,
  validateUser,
} from "@/features/auth/helper/login-helper";
import { signAccessToken, signRefreshToken } from "@/features/auth/lib/sessions";
import {
  errorResponse,
  internalServerError,
  sendSuccess,
} from "@/helper/response-helper";
import { getClientInfo } from "@/lib/client-info";
import { formatGeoLocation, whoisGeoLocation } from "@/lib/whois";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const clientInfo = getClientInfo(req);

    // validate input
    const parsed = await validateLoginForm(req);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      throw new AuthInvalidCredentials(errors);
    }

    const { email, password } = parsed.data;

    // validate user
    const user = await validateUser(email, password);

    if (!user) {
      throw new AuthInvalidCredentials({
        email: ["Invalid email or password"],
        password: ["Invalid email or password"],
      });
    }

    // get client geo location
    const geo = await whoisGeoLocation(clientInfo.ip);
    const formattedGeo = formatGeoLocation(geo);

    if (!formattedGeo) {
      throw new ResourceNotFound("Geo location not found", {
        email: ["geo location not found"],
        password: ["geo location not found"],
      });
    }

    // create session
    const sessionId = uuidv4();
    const accessToken = await signAccessToken({ userId: user.id, sessionId });
    const refreshToken = await signRefreshToken({ sessionId });

    await createSession({
      sessionId,
      userId: user.id,
      refreshToken,
      ...clientInfo,
      ...formattedGeo,
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
    setAuthCookies(response, accessToken, refreshToken);

    return response;
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
