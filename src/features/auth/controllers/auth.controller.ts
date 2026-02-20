import { sendSuccess } from "@/shared/utils/response-helper";
import { AuthHttp } from "../http/auth.http";
import { ClientInfoHttp } from "../http/client-info.http";
import { CookieHttp } from "../http/cookie.http";
import { RefreshTokenHttp } from "../http/refresh-token.http";
import { AuthService } from "../services/auth.service";
import { CreateController } from "./create.controller";

export const AuthController = {
  login: CreateController.create(async (req: Request) => {
    const clientInfo = ClientInfoHttp.info(req);
    const geolocation = ClientInfoHttp.geoLocation(req, clientInfo.ip);

    const result = await AuthHttp.validateLoginFormData(req);

    const context = { geo: geolocation, clientInfo };
    const { tokens, user } = await AuthService.login(result, context);

    const { accessToken, refreshToken } = tokens;
    const userData = { id: user.id, email: user.email, name: user.name };
    const response = sendSuccess(userData, "Login successfully");

    CookieHttp.set({ response, accessToken, refreshToken });
    return response;
  }),

  register: CreateController.create(async (req: Request) => {
    const result = await AuthHttp.validateRegisterFormData(req);
    const resultRegister = await AuthService.register(result);

    return sendSuccess(resultRegister, "Register successfully");
  }),

  logout: CreateController.create(async (req: Request) => {
    const { sessionId } = await RefreshTokenHttp.requireValidRefreshToken(req);
    await AuthService.logout(sessionId);

    const response = sendSuccess(null, "Logout successfully");
    await CookieHttp.clear(response);

    return response;
  }),
};
