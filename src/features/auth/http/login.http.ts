import { AuthInvalidCredentials } from "@/shared/errors/auth-error";
import { LoginSchema, validateLoginForm } from "../schemas/login.schema";

export const LoginHttp = {
  // DOC: validate form data for forgot password
  async validateFormData(req: Request) {
    const formData = await req.formData();
    const input = Object.fromEntries(formData);
    const result = await validateLoginForm(input);

    if (result.isError) throw new AuthInvalidCredentials(result.errors!);

    return result.data as LoginSchema;
  },
};
