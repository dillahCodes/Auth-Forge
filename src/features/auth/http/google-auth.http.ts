import { ClientRouters } from "@/routers/client-router";
import { GoogleAuthMissingCode } from "@/shared/errors/auth-error";
import { GoogleAuthCallbackErrors } from "../types/google-auth";

export const GoogleAuthHttp = {
  async validateUrlCode(req: Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) throw new GoogleAuthMissingCode("Missing code");
    return code;
  },

  validateCallbackError(req: Request) {
    const { searchParams } = new URL(req.url);
    const error = searchParams.get("error");

    if (!error) return null;
    if (GoogleAuthCallbackErrors.ACCESS_DENIED.includes(error)) return ClientRouters.LOGIN;
  },
};
