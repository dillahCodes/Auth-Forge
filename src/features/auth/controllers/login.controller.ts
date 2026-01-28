import { sendSuccess } from "@/shared/utils/response-helper";
import { ClientInfoHttp } from "../http/client-info.http";
import { CookieHttp } from "../http/cookie.http";
import { LoginHttp } from "../http/login.http";
import { AuthService } from "../services/auth.service";
import { CreateController } from "./create.controller";

export const LoginController = {
  login: CreateController.create(async (req: Request) => {
    // DOC: get client info and geo location
    const clientInfo = ClientInfoHttp.info(req);
    const geolocation = ClientInfoHttp.geoLocation(req, clientInfo.ip);

    // DOC: validate input and get credentials
    const result = await LoginHttp.validateFormData(req);

    // DOC: perform login
    const context = { geo: geolocation, clientInfo };
    const { tokens, user } = await AuthService.login(result, context);

    // DOC: set cookies and return response
    const userData = { id: user.id, email: user.email, name: user.name };
    const response = sendSuccess(userData, "Login successfully");

    // DOC: set auth cookies in client browser
    CookieHttp.set({
      response,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });

    return response;
  }),
};
