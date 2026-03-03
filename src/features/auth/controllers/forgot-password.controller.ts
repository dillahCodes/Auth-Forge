import { sendSuccess } from "@/shared/utils/response-helper";
import { ClientInfoHttp } from "../http/client-info.http";
import { ForgotPasswordHttp } from "../http/forgot-password.http";
import { ForgotPasswordService } from "../services/forgot-password.service";
import { CreateController } from "./create.controller";

export const ForgotPasswordController = {
  sendForgotPasswordEmail: CreateController.create(async (req: Request) => {
    const { vercelTlsFingerprint } = ClientInfoHttp.info(req);
    const { email } = await ForgotPasswordHttp.validateFormData(req, "send");

    await ForgotPasswordService.send({ email, vercelTlsFingerprint });
    return sendSuccess(null, "Forgot password email sent successfully");
  }),

  verifyOtpForgotPassword: CreateController.create(async (req: Request) => {
    const { vercelTlsFingerprint } = ClientInfoHttp.info(req);
    const input = await ForgotPasswordHttp.validateFormData(req, "verify");

    await ForgotPasswordService.verify({ input, vercelTlsFingerprint });
    return sendSuccess(null, "Password reset successfully");
  }),
};
