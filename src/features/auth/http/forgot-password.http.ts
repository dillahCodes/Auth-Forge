import { ResourceUnprocessableEntity } from "@/shared/errors/resource-error";
import {
  ForgotPasswordEmailSchema,
  ForgotPasswordSchema,
  validateForgotPasswordForm,
} from "../schemas/forgot-password.schema";

interface ForgotPasswordHttpContract {
  validateFormData(req: Request, forEndpoint: "send"): Promise<ForgotPasswordEmailSchema>;
  validateFormData(req: Request, forEndpoint: "verify"): Promise<ForgotPasswordSchema>;
}

export const ForgotPasswordHttp: ForgotPasswordHttpContract = {
  // DOC: Validate form data for forgot password
  async validateFormData<T>(req: Request, forEndpoint: "send" | "verify") {
    const formData = await req.formData();
    const input = Object.fromEntries(formData);
    const parsed = await validateForgotPasswordForm({ forEndpoint, input });

    if (parsed.isError) {
      throw new ResourceUnprocessableEntity("Please check your form", parsed.errors!);
    }

    return parsed.data as T;
  },
};
