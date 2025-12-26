import { AppError } from "@/errors/app-error";
import { AuthInvalidCredentials } from "@/errors/auth-error";
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
import { getClientLocation } from "@/lib/client-location";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { ip, userAgent } = getClientInfo(req);
    const location = getClientLocation(req);

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

    // create session
    const sessionId = uuidv4();
    const accessToken = await signAccessToken({ userId: user.id, sessionId });
    const refreshToken = await signRefreshToken({ sessionId });

    await createSession({
      sessionId,
      userId: user.id,
      refreshToken,
      ip,
      userAgent,
      ...location,
    });

    const userData = { id: user.id, email: user.email, name: user.name };
    const response = sendSuccess(userData, "Login successfully");

    setAuthCookies(response, accessToken, refreshToken);
    return response;
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
