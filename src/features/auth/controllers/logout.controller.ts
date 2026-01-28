import { sendSuccess } from "@/shared/utils/response-helper";
import { CookieHttp } from "../http/cookie.http";
import { RefreshTokenHttp } from "../http/refresh-token.http";
import { AuthService } from "../services/auth.service";
import { CreateController } from "./create.controller";

export const LogoutController = {
  logout: CreateController.create(async (req: Request) => {
    const { sessionId } = await RefreshTokenHttp.requireValidRefreshToken(req);

    await AuthService.logout(sessionId);

    const response = sendSuccess(null, "Logout successfully");
    await CookieHttp.clear(response);

    return response;
  }),
};
