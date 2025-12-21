import {
  setAuthCookies,
  upsertSession,
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

    // Validate Request
    const parsed = await validateLoginForm(req);
    if (!parsed.success) {
      return badRequest("Please check your input", parsed.error.flatten().fieldErrors);
    }

    const { email, password } = parsed.data;

    // Validate User
    const user = await validateUser(email, password);
    if (!user) {
      return unauthorized("Please check your input", {
        email: ["Invalid email or password"],
        password: ["Invalid email or password"],
      });
    }

    // Generate Tokens
    const sessionId = uuidv4();
    const accessToken = await signAccessToken({ userId: user.id, sessionId });
    const refreshToken = await signRefreshToken({ sessionId });

    // Insert / Update Session
    await upsertSession({
      userId: user.id,
      sessionId,
      refreshToken,
      ip,
      userAgent,
      city,
      country,
      countryRegion,
      region,
    });

    // Send Response
    const response = sendSuccess(
      { userId: user.id, name: user.name, email: user.email },
      "Login successfully"
    );
    setAuthCookies(response, accessToken, refreshToken);

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return serverError(error);
  }
}
