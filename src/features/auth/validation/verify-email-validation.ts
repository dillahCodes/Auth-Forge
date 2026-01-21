import { ResourceUnprocessableEntity } from "@/errors/resource-error";
import { verifyEmailOtpSchema } from "../schemas/verify-email-schema";

export const validateOtpVerifyEmail = async (req: Request) => {
  const formData = await req.formData();
  const res = verifyEmailOtpSchema.safeParse(Object.fromEntries(formData));

  if (!res.success) {
    const errors = res.error.flatten().fieldErrors;
    throw new ResourceUnprocessableEntity("Validation failed", errors);
  }

  return res;
};
