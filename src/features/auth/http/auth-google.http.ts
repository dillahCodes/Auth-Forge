import { ClientRouters } from "@/routers/client-router";
import { GoogleAuthMissingCode } from "@/shared/errors/auth-error";
import { GoogleAuthCallbackErrors } from "../types/google-auth";

export const AuthGoogleHttp = {
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

  getRedirectUrlAfterAuth(req: Request, params?: string | null) {
    const url = new URL(req.url);
    const stateRaw = url.searchParams.get("state");
    if (!stateRaw) return new URL(ClientRouters.DASHBOARD, process.env.BASE_URL!);

    const { redirectTo }: { redirectTo: string } = JSON.parse(stateRaw);
    const redirectUrl = new URL(redirectTo, process.env.BASE_URL!);

    if (params) {
      const resultParams = new URLSearchParams(params);

      resultParams.forEach((value, key) => {
        redirectUrl.searchParams.set(key, value);
      });
    }

    return redirectUrl;
  },
};
