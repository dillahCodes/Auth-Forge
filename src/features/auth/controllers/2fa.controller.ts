import { sendSuccess } from "@/shared/utils/response-helper";
import { TwoFaHttp } from "../http/2fa.http";
import { AccessTokenHttp } from "../http/access-token.http";
import { ClientInfoHttp } from "../http/client-info.http";
import { CookieHttp } from "../http/cookie.http";
import { TwoFaService } from "../services/2fa.service";
import { SessionService } from "../services/session.service";
import { CreateController } from "./create.controller";

export const TwoFaController = {
  sendOtp: CreateController.create(async (req: Request) => {
    const clientInfo = ClientInfoHttp.info(req);
    const geolocation = ClientInfoHttp.geoLocation(req, clientInfo.ip);
    const location = `${geolocation.city}, ${geolocation.country}`;

    const { userId, sessionId } = await AccessTokenHttp.requiredAccessToken(req);
    const input = await TwoFaHttp.validateFormData(req, "send");
    await SessionService.validateSessionForAccessToken(sessionId);

    await TwoFaService.sendOtp({ location, userId, input });
    return sendSuccess(null, "Send otp successfully");
  }),

  verifyOtp: CreateController.create(async (req: Request) => {
    const { userId, sessionId } = await AccessTokenHttp.requiredAccessToken(req);
    const input = await TwoFaHttp.validateFormData(req, "verify");

    await SessionService.validateSessionForAccessToken(sessionId);
    const { twoFaToken } = await TwoFaService.verifyOtp({ userId, sessionId, input });

    const response = sendSuccess(null, "Verify otp successfully");
    CookieHttp.set({ response, twoFaToken });
    return response;
  }),
};
