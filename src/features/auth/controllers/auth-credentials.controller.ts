import { sendSuccess } from "@/shared/utils/response-helper";
import { TwoFaHttp } from "../http/2fa.http";
import { AccessTokenHttp } from "../http/access-token.http";
import { AuthCredentialsHttp } from "../http/auth-credentials.http";
import { ClientInfoHttp } from "../http/client-info.http";
import { CookieHttp } from "../http/cookie.http";
import { RefreshTokenHttp } from "../http/refresh-token.http";
import { AuthCredentialsService } from "../services/auth-credentials.service";
import { CreateController } from "./create.controller";

export const AuthCredentialsController = {
  login: CreateController.create(async (req: Request) => {
    const clientInfo = ClientInfoHttp.info(req);
    const geolocation = ClientInfoHttp.geoLocation(req, clientInfo.ip);

    const result = await AuthCredentialsHttp.validateFormData(req, "LOGIN");

    const context = { geo: geolocation, clientInfo };
    const { tokens, user } = await AuthCredentialsService.login(result, context);

    const { accessToken, refreshToken } = tokens;
    const userData = { id: user.id, email: user.email, name: user.name };
    const response = sendSuccess(userData, "Login successfully");

    CookieHttp.set({ response, accessToken, refreshToken });
    return response;
  }),

  register: CreateController.create(async (req: Request) => {
    const result = await AuthCredentialsHttp.validateFormData(req, "REGISTER");
    const resultRegister = await AuthCredentialsService.register(result);

    return sendSuccess(resultRegister, "Register successfully");
  }),

  logout: CreateController.create(async (req: Request) => {
    const { sessionId } = await RefreshTokenHttp.requireValidRefreshToken(req);
    await AuthCredentialsService.logout(sessionId);

    const response = sendSuccess(null, "Logout successfully");
    await CookieHttp.clear(response);

    return response;
  }),

  connect: CreateController.create(async (req: Request) => {
    const { userId, sessionId, provider } = await AccessTokenHttp.requiredAccessToken(req);
    await TwoFaHttp.requiredTwoFaToken(req, "TOGGLE_CREDENTIALS_CONNECTION");
    const result = await AuthCredentialsHttp.validateFormData(req, "CONNECT");

    await AuthCredentialsService.connect({ input: result, userId, sessionId, currentProvider: provider });

    const resultMessage = result.mode === "UNBIND" ? "Unbind credentials successfully" : "Connect credentials successfully";
    const respose = sendSuccess(null, resultMessage);

    await CookieHttp.clearByName(respose, "2fa_token");
    return respose;
  }),
};
