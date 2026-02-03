import { sendSuccess } from "@/shared/utils/response-helper";
import { ClientInfoHttp } from "../http/client-info.http";
import { RevertAccountHttp } from "../http/revert-account.http";
import { RevertAccountService } from "../services/revert-account.service";
import { CreateController } from "./create.controller";

export const RevertAccountController = {
  verifyTokenRevertAccount: CreateController.create(async (req: Request) => {
    const { vercelTlsFingerprint } = ClientInfoHttp.info(req);
    const input = await RevertAccountHttp.validateFormData(req);

    await RevertAccountService.verify({ vercelTlsFingerprint, input });
    return sendSuccess(null, "Revert account successfully");
  }),
};
