import { AuthUnauthorized } from "@/shared/errors/auth-error";
import { RefreshTokenPayload, TokenService } from "../services/token.service";
import { CookieHttp } from "./cookie.http";

export const RefreshTokenHttp = {
  async requireValidRefreshToken(req: Request) {
    const refreshToken = CookieHttp.getCookie(req, "refresh_token");
    if (!refreshToken) throw new AuthUnauthorized();

    // DOC: decrypt & validate refresh token
    const result = await TokenService.verify<RefreshTokenPayload>(refreshToken);
    if (!result.valid || !result.payload.sessionId) throw new AuthUnauthorized();

    return {
      refreshToken,
      sessionId: result.payload.sessionId,
    };
  },
};
