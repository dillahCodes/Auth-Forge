import { sendSuccess } from "@/shared/utils/response-helper";
import { RegisterHttp } from "../http/register.http";
import { AuthService } from "../services/auth.service";
import { CreateController } from "./create.controller";
import { ClientInfoHttp } from "../http/client-info.http";

export const RegisterController = {
  register: CreateController.create(async (req: Request) => {
    const { vercelTlsFingerprint } = ClientInfoHttp.info(req);
    const result = await RegisterHttp.validateFormData(req);
    const resultRegister = await AuthService.register(result, vercelTlsFingerprint);

    return sendSuccess(resultRegister, "Register successfully");
  }),
};
