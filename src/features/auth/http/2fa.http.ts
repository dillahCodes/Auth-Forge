import { TwoFaInvalidScope, TwoFaRequired } from "@/shared/errors/auth-error";
import { ResourceUnprocessableEntity } from "@/shared/errors/resource-error";
import { TwoFaSchema, TwoFaScopeSchema, validateTwoFaForm } from "../schemas/2fa.schema";
import { TokenService, TwoFaTokenPayload } from "../services/token.service";
import { CookieHttp } from "./cookie.http";
import { StatusTwoFaToken } from "../types/2fa";

interface StatusTwoFaTokenReturn {
  status: StatusTwoFaToken;
  scopeTarget: TwoFaScopeSchema["scope"];
  scopePayload: TwoFaScopeSchema["scope"] | null;
}

interface TwoFaHttpContract {
  validateFormData(req: Request, forEndpoint: "send"): Promise<TwoFaScopeSchema>;
  validateFormData(req: Request, forEndpoint: "verify"): Promise<TwoFaSchema>;
  validateFormData(req: Request, forEndpoint: "status"): Promise<TwoFaScopeSchema>;
  requiredTwoFaToken(req: Request, scopeTarget: TwoFaScopeSchema["scope"]): Promise<void>;
  statusTwoFaToken(req: Request, scopeTarget: TwoFaScopeSchema["scope"]): Promise<StatusTwoFaTokenReturn>;
}

export const TwoFaHttp: TwoFaHttpContract = {
  // DOC: Validate form data for forgot password
  async validateFormData<T>(req: Request, forEndpoint: "send" | "verify" | "status") {
    const formData = await req.formData();
    const input = Object.fromEntries(formData);
    const parsed = await validateTwoFaForm({ forEndpoint, input });

    if (parsed.isError) throw new ResourceUnprocessableEntity("Please check your form", parsed.errors!);
    return parsed.data as T;
  },

  // DOC: Validate incoming 2fa token
  async requiredTwoFaToken(req: Request, scopeTarget: TwoFaScopeSchema["scope"]) {
    const twoFaToken = CookieHttp.getCookie(req, "2fa_token");
    if (!twoFaToken) throw new TwoFaRequired();

    const result = await TokenService.verify<TwoFaTokenPayload>(twoFaToken);
    if (!result.valid) throw new TwoFaRequired();

    if (result.payload.scope !== scopeTarget) throw new TwoFaInvalidScope();
  },

  // DOC: Get status of 2fa token
  async statusTwoFaToken(req: Request, scopeTarget: TwoFaScopeSchema["scope"]) {
    const twoFaToken = CookieHttp.getCookie(req, "2fa_token");
    if (!twoFaToken) return { status: StatusTwoFaToken.MISSING, scopeTarget, scopePayload: null };

    const verification = await TokenService.verify<TwoFaTokenPayload>(twoFaToken);

    if (!verification.valid) {
      return {
        status: verification.reason === "expired" ? StatusTwoFaToken.EXPIRED : StatusTwoFaToken.MISSING,
        scopeTarget,
        scopePayload: null,
      };
    }

    const { payload } = verification;

    if (payload.scope !== scopeTarget) {
      return { status: StatusTwoFaToken.INVALID_SCOPE, scopeTarget, scopePayload: payload.scope };
    }

    return {
      status: StatusTwoFaToken.AVAILABLE,
      scopeTarget,
      scopePayload: payload.scope,
    };
  },
};
