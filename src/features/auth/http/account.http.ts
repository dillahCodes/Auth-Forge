import { ResourceUnprocessableEntity } from "@/shared/errors/resource-error";
import {
  AccountFormForEndpoint,
  ChangeEmailSchema,
  ChangeEmailUpdateSchema,
  ChangeEmailVerifySchema,
  ChangeNameSchema,
  ChangePasswordSchema,
  validateAccountForm,
} from "../schemas/account.schema";

interface AccountHttpContract {
  validateFormData(req: Request, forEndpoint: "CHANGE_NAME"): Promise<ChangeNameSchema>;
  validateFormData(req: Request, forEndpoint: "CHANGE_EMAIL"): Promise<ChangeEmailSchema>;
  validateFormData(req: Request, forEndpoint: "CHANGE_EMAIL_UPDATE"): Promise<ChangeEmailUpdateSchema>;
  validateFormData(req: Request, forEndpoint: "CHANGE_EMAIL_VERIFY"): Promise<ChangeEmailVerifySchema>;
  validateFormData(req: Request, forEndpoint: "CHANGE_PASSWORD"): Promise<ChangePasswordSchema>;
}

export const AccountHttp: AccountHttpContract = {
  // DOC: Validate form data for Account
  async validateFormData<T>(req: Request, forEndpoint: AccountFormForEndpoint) {
    const formData = await req.formData();
    const input = Object.fromEntries(formData);
    const parsed = await validateAccountForm({ forEndpoint, input });

    if (parsed.isError) throw new ResourceUnprocessableEntity("Please check your form", parsed.errors!);
    return parsed.data as T;
  },
};
