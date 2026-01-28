import { sendSuccess } from "@/shared/utils/response-helper";
import { AccessTokenHttp } from "../http/access-token.http";
import { VerifyEmailHttp } from "../http/verify-email.http";
import { VerifyEmailService } from "../services/verify-email.service";
import { CreateController } from "./create.controller";

export const VerifyEmailController = {
  // DOC: send verification email
  sendEmailVerify: CreateController.create(async (req: Request) => {
    const { userId } = await AccessTokenHttp.requiredAccessToken(req);
    await VerifyEmailService.send(userId);

    return sendSuccess(null, "Verification email sent successfully");
  }),

  // DOC: verify email
  verifyEmailOtp: CreateController.create(async (req: Request) => {
    const { userId } = await AccessTokenHttp.requiredAccessToken(req);

    // DOC: validate input and perform verification
    const result = await VerifyEmailHttp.validateFormData(req);
    await VerifyEmailService.verify(userId, result.otp);

    return sendSuccess(null, "Verification email successfully");
  }),
};
