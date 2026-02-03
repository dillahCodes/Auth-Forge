import { ResourceUnprocessableEntity } from "@/shared/errors/resource-error";
import { RevertAccountSchema, validateRevertAccountForm } from "../schemas/revert-account.schema";

export const RevertAccountHttp = {
  // DOC: Validate form data for forgot password
  async validateFormData(req: Request) {
    const formData = await req.formData();
    const input = Object.fromEntries(formData);
    const parsed = await validateRevertAccountForm({ input });

    if (parsed.isError) throw new ResourceUnprocessableEntity("Please check your form", parsed.errors!);
    return parsed.data as RevertAccountSchema;
  },
};
