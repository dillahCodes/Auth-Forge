import { AuthTokenExpired } from "@/errors/auth-error";
import { decrypt, getCookie, type AccessTokenPayload } from "../lib/sessions";

type RequiredAccessTokenResult = {
  userId: string;
  sessionId: string;
};

export default async function requiredAccessToken(
  req: Request
): Promise<RequiredAccessTokenResult> {
  // Check if the access token is present
  const accessToken = getCookie(req, "access_token");
  if (!accessToken) throw new AuthTokenExpired();

  // Check if the token is valid
  const result = await decrypt<AccessTokenPayload>(accessToken);
  if (!result.valid) throw new AuthTokenExpired();

  const { userId, sessionId } = result.payload;
  return { userId, sessionId };
}
