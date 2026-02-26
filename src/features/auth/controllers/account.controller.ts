import { sendSuccess } from "@/shared/utils/response-helper";
import { TwoFaHttp } from "../http/2fa.http";
import { AccessTokenHttp } from "../http/access-token.http";
import { AccountHttp } from "../http/account.http";
import { ClientInfoHttp } from "../http/client-info.http";
import { CookieHttp } from "../http/cookie.http";
import { AccountService } from "../services/account.service";
import { CreateController } from "./create.controller";
import { SessionService } from "../services/session.service";

export const AccountController = {
  changeName: CreateController.create(async (req: Request) => {
    const { userId, sessionId } = await AccessTokenHttp.requiredAccessToken(req);
    const { name } = await AccountHttp.validateFormData(req, "CHANGE_NAME");

    await SessionService.validateSessionForAccessToken(sessionId);
    const result = await AccountService.changeName(name, userId);
    return sendSuccess(result, "Change name successfully");
  }),

  changeEmailRequest: CreateController.create(async (req: Request) => {
    const { userId, sessionId } = await AccessTokenHttp.requiredAccessToken(req);
    const input = await AccountHttp.validateFormData(req, "CHANGE_EMAIL");
    await TwoFaHttp.requiredTwoFaToken(req, "CHANGE_EMAIL", userId);

    await SessionService.validateSessionForAccessToken(sessionId);
    await AccountService.changeEmailRequest(input, userId);

    const response = sendSuccess(null, "Request Change email successfully");
    await CookieHttp.clearByName(response, "2fa_token");
    return response;
  }),

  changeEmailRequestUpdate: CreateController.create(async (req: Request) => {
    const { userId, sessionId } = await AccessTokenHttp.requiredAccessToken(req);
    const input = await AccountHttp.validateFormData(req, "CHANGE_EMAIL_UPDATE");

    await SessionService.validateSessionForAccessToken(sessionId);
    await AccountService.changeEmailRequestUpdate(input, userId);
    return sendSuccess(null, "Update request change email successfully");
  }),

  changeEmailCancelRequest: CreateController.create(async (req: Request) => {
    const { userId, sessionId } = await AccessTokenHttp.requiredAccessToken(req);
    await SessionService.validateSessionForAccessToken(sessionId);
    await AccountService.changeEmailCancelRequest(userId);
    return sendSuccess(null, "Cancel change email successfully");
  }),

  changeEmailSendVerify: CreateController.create(async (req: Request) => {
    const { userId, sessionId } = await AccessTokenHttp.requiredAccessToken(req);

    await SessionService.validateSessionForAccessToken(sessionId);
    await AccountService.changeEmailSendVerify(userId);

    return sendSuccess(null, "Verification email sent successfully");
  }),

  changeEmailVerify: CreateController.create(async (req: Request) => {
    const { vercelTlsFingerprint } = ClientInfoHttp.info(req);
    const { userId, sessionId } = await AccessTokenHttp.requiredAccessToken(req);
    const input = await AccountHttp.validateFormData(req, "CHANGE_EMAIL_VERIFY");

    await SessionService.validateSessionForAccessToken(sessionId);
    await AccountService.changeEmailVerify({ input, userId, vercelTlsFingerprint, sessionId });
    return sendSuccess(null, "Change email successfully");
  }),

  changePassword: CreateController.create(async (req: Request) => {
    const { vercelTlsFingerprint } = ClientInfoHttp.info(req);
    const { userId, sessionId } = await AccessTokenHttp.requiredAccessToken(req);

    const input = await AccountHttp.validateFormData(req, "CHANGE_PASSWORD");
    await TwoFaHttp.requiredTwoFaToken(req, "CHANGE_PASSWORD", userId);

    await SessionService.validateSessionForAccessToken(sessionId);
    await AccountService.changePassword({ input, userId, vercelTlsFingerprint, sessionId });

    const response = sendSuccess(null, "Change password successfully");
    await CookieHttp.clearByName(response, "2fa_token");
    return response;
  }),
};
