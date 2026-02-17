import { TwoFaInvalidScope, TwoFaRequired } from "@/shared/errors/auth-error";
import { ResourceUnprocessableEntity } from "@/shared/errors/resource-error";
import { TwoFaSchema, TwoFaScopeSchema, validateTwoFaForm } from "../schemas/2fa.schema";
import { TokenService } from "../services/token.service";
import { CookieHttp } from "./cookie.http";

interface TwoFaHttpContract {
  validateFormData(req: Request, forEndpoint: "send"): Promise<TwoFaScopeSchema>;
  validateFormData(req: Request, forEndpoint: "verify"): Promise<TwoFaSchema>;
  requiredTwoFaToken(req: Request, scopeTarget: TwoFaScopeSchema["scope"]): Promise<void>;
}

export const TwoFaHttp: TwoFaHttpContract = {
  // DOC: Validate form data for forgot password
  async validateFormData<T>(req: Request, forEndpoint: "send" | "verify") {
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

    const result = await TokenService.verify<TwoFaScopeSchema>(twoFaToken);
    if (!result.valid) throw new TwoFaRequired();

    if (result.payload.scope !== scopeTarget) throw new TwoFaInvalidScope();
  },
};
