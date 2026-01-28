import { ValidationFailed } from "@/shared/errors/auth-error";
import { RegisterSchema, validateRegisterForm } from "../schemas/register.schema";

export const RegisterHttp = {
  // DOC: validate register form data
  async validateFormData(req: Request) {
    const formData = await req.formData();
    const input = Object.fromEntries(formData);
    const result = await validateRegisterForm(input);

    if (result.isError) throw new ValidationFailed(result.errors!);
    return result.data as RegisterSchema;
  },
};
