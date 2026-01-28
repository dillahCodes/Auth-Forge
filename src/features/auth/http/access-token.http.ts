import { AuthTokenExpired } from "@/shared/errors/auth-error";
import { AccessTokenPayload, TokenService } from "../services/token.service";
import { CookieHttp } from "./cookie.http";

export const AccessTokenHttp = {
  async requiredAccessToken(req: Request): Promise<AccessTokenPayload> {
    // DOC: get access token from cookie
    const accessToken = CookieHttp.getCookie(req, "access_token");
    if (!accessToken) throw new AuthTokenExpired();

    // DOC: decrypt & validate access token
    const result = await TokenService.verify<AccessTokenPayload>(accessToken);
    if (!result.valid) throw new AuthTokenExpired();

    const { userId, sessionId, permissions, verifiedAt } = result.payload;

    return {
      userId,
      sessionId,
      permissions,
      verifiedAt,
    };
  },
};
