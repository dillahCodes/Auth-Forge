import { ResourceUnprocessableEntity } from "@/shared/errors/resource-error";
import {
  RevertAccountEmailSchema,
  RevertAccountPasswordSchema,
  ValidateRevertAccountForm,
  validateRevertAccountForm,
} from "../schemas/revert-account.schema";

interface RevertAccountContract {
  validateFormData(req: Request, forEndpoint: "VERIFY_REVERT_PASSWORD"): Promise<RevertAccountPasswordSchema>;
  validateFormData(req: Request, forEndpoint: "VERIFY_REVERT_EMAIL"): Promise<RevertAccountEmailSchema>;
}

export const RevertAccountHttp: RevertAccountContract = {
  // DOC: Validate form data for forgot password
  async validateFormData<T>(req: Request, forEndpoint: ValidateRevertAccountForm["forEndpoint"]) {
    const formData = await req.formData();
    const input = Object.fromEntries(formData);
    const parsed = await validateRevertAccountForm({ input, forEndpoint });

    if (parsed.isError) throw new ResourceUnprocessableEntity("Please check your form", parsed.errors!);
    return parsed.data as T;
  },
};
