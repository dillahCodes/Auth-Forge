import {
  getSessionId,
  setAuthCookies,
  upsertRefreshToken,
  validateLoginForm,
  validateUser,
} from "@/features/auth/helper/login-helper";
import { signAccessToken, signRefreshToken } from "@/features/auth/lib/sessions";
import {
  badRequest,
  sendSuccess,
  serverError,
  unauthorized,
} from "@/helper/response-helper";
import { getClientInfo } from "@/lib/client-info";
import { getClientLocation } from "@/lib/client-location";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { ip, userAgent } = getClientInfo(req);
    const { city, country, countryRegion, region } = getClientLocation(req);

    // Validate login form
    const parsed = await validateLoginForm(req);
    if (!parsed.success) {
      return badRequest("Please check your input", parsed.error.flatten().fieldErrors);
    }

    const { email, password } = parsed.data;

    // Validate user
    const user = await validateUser(email, password);
    if (!user) {
      return unauthorized("Please check your input", {
        email: ["Invalid email or password"],
        password: ["Invalid email or password"],
      });
    }

    // Generate session & tokens
    const resultgetSessionId = await getSessionId({ ip, userAgent, userId: user.id });
    const sessionId = resultgetSessionId ? resultgetSessionId : uuidv4();

    const accessToken = await signAccessToken({ userId: user.id, sessionId });
    const refreshToken = await signRefreshToken({ sessionId });

    await upsertRefreshToken({
      sessionId,
      refreshToken,
      userId: user.id,
      ip,
      city,
      country,
      countryRegion,
      region,
      userAgent,
    });

    const userData = { userId: user.id, name: user.name, email: user.email };
    const response = sendSuccess(userData, "Login successfully");
    setAuthCookies(response, accessToken, refreshToken);
    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return serverError(error);
  }
}
