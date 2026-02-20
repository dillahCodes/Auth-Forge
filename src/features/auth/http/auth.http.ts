import { AuthInvalidCredentials, ValidationFailed } from "@/shared/errors/auth-error";
import { LoginSchema, validateLoginForm } from "../schemas/login.schema";
import { RegisterSchema, validateRegisterForm } from "../schemas/register.schema";

export const AuthHttp = {
  async validateRegisterFormData(req: Request) {
    const formData = await req.formData();
    const input = Object.fromEntries(formData);
    const result = await validateRegisterForm(input);

    if (result.isError) throw new ValidationFailed(result.errors!);
    return result.data as RegisterSchema;
  },

  async validateLoginFormData(req: Request) {
    const formData = await req.formData();
    const input = Object.fromEntries(formData);
    const result = await validateLoginForm(input);

    if (result.isError) throw new AuthInvalidCredentials(result.errors!);
    return result.data as LoginSchema;
  },
};
