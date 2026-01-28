import { ResourceUnprocessableEntity } from "@/shared/errors/resource-error";
import { validateOtpVerifyEmail, VerifyEmailOtpSchema } from "../schemas/verify-email.schema";

export const VerifyEmailHttp = {
  // DOC: Validate form data
  async validateFormData(req: Request) {
    const formData = await req.formData();
    const input = Object.fromEntries(formData);
    const parsed = await validateOtpVerifyEmail(input);

    if (parsed.isError) {
      throw new ResourceUnprocessableEntity("Please check your form", parsed.errors!);
    }

    return parsed.data as VerifyEmailOtpSchema;
  },
};
