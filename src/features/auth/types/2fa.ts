import { TwoFaScopeSchema } from "../schemas/2fa.schema";

export interface TwoFaStatusResponse {
  status: StatusTwoFaToken;
  scopeTarget: TwoFaScopeSchema["scope"];
  scopePayload: TwoFaScopeSchema["scope"] | null;
}

export enum StatusTwoFaToken {
  AVAILABLE = "AVAILABLE",
  MISSING = "MISSING",
  EXPIRED = "EXPIRED",
  INVALID_SCOPE = "INVALID_SCOPE",
}
