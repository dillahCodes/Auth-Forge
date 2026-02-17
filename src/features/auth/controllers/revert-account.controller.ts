import { sendSuccess } from "@/shared/utils/response-helper";
import { ClientInfoHttp } from "../http/client-info.http";
import { CookieHttp } from "../http/cookie.http";
import { RevertAccountHttp } from "../http/revert-account.http";
import { RevertAccountService } from "../services/revert-account.service";
import { CreateController } from "./create.controller";

export const RevertAccountController = {
  verifyTokenRevertAccountPasswordChange: CreateController.create(async (req: Request) => {
    const { vercelTlsFingerprint } = ClientInfoHttp.info(req);
    const input = await RevertAccountHttp.validateFormData(req, "VERIFY_REVERT_PASSWORD");

    await RevertAccountService.verifyRevertAccountPasswordChange({ vercelTlsFingerprint, input });

    const response = sendSuccess(null, "Revert account successfully");
    await CookieHttp.clear(response);
    return response;
  }),

  verifyTokenRevertAccountEmailChange: CreateController.create(async (req: Request) => {
    const { vercelTlsFingerprint } = ClientInfoHttp.info(req);
    const input = await RevertAccountHttp.validateFormData(req, "VERIFY_REVERT_EMAIL");

    await RevertAccountService.verifyRevertAccountEmailChange({ input, vercelTlsFingerprint });

    const response = sendSuccess(null, "Revert account successfully");
    await CookieHttp.clear(response);
    return response;
  }),
};
