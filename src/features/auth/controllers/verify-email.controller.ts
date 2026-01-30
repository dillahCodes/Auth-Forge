import { sendSuccess } from "@/shared/utils/response-helper";
import { AccessTokenHttp } from "../http/access-token.http";
import { VerifyEmailHttp } from "../http/verify-email.http";
import { VerifyEmailService } from "../services/verify-email.service";
import { CreateController } from "./create.controller";
import { CookieHttp } from "../http/cookie.http";

export const VerifyEmailController = {
  // DOC: send verification email
  sendEmailVerify: CreateController.create(async (req: Request) => {
    const { userId } = await AccessTokenHttp.requiredAccessToken(req, { requireEmailVerification: false });
    await VerifyEmailService.send(userId);

    return sendSuccess(null, "Verification email sent successfully");
  }),

  // DOC: verify email
  verifyEmailOtp: CreateController.create(async (req: Request) => {
    const { userId, sessionId } = await AccessTokenHttp.requiredAccessToken(req, { requireEmailVerification: false });

    // DOC: validate input and perform verification
    const { otp } = await VerifyEmailHttp.validateFormData(req);
    const { accessToken } = await VerifyEmailService.verify(userId, otp, sessionId);

    // DOC: return response and give new access token
    const response = sendSuccess(null, "Verification email successfully");
    CookieHttp.set({ response, accessToken });

    return response;
  }),
};
