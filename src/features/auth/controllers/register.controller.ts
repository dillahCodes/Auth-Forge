import { sendSuccess } from "@/shared/utils/response-helper";
import { RegisterHttp } from "../http/register.http";
import { AuthService } from "../services/auth.service";
import { CreateController } from "./create.controller";

export const RegisterController = {
  register: CreateController.create(async (req: Request) => {
    const result = await RegisterHttp.validateFormData(req);
    const resultRegister = await AuthService.register(result);

    return sendSuccess(resultRegister, "Register successfully");
  }),
};
