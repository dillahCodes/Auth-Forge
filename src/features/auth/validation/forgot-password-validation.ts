import z, { ZodSafeParseSuccess } from "zod";
import {
  forgotPasswordEmailSchema,
  forgotPasswordSchema,
} from "../schemas/forgot-password-schema";
import { ResourceUnprocessableEntity } from "@/errors/resource-error";

interface ValidateForgotPasswordForm {
  req: Request;
  forEndpoint: "send" | "verify";
}

export function validateForgotPasswordForm(arg: {
  req: Request;
  forEndpoint: "send";
}): Promise<ZodSafeParseSuccess<z.infer<typeof forgotPasswordEmailSchema>>>;

export function validateForgotPasswordForm(arg: {
  req: Request;
  forEndpoint: "verify";
}): Promise<ZodSafeParseSuccess<z.infer<typeof forgotPasswordSchema>>>;

export async function validateForgotPasswordForm({
  forEndpoint,
  req,
}: ValidateForgotPasswordForm) {
  const formData = await req.formData();
  const schema = { send: forgotPasswordEmailSchema, verify: forgotPasswordSchema };
  const result = schema[forEndpoint].safeParse(Object.fromEntries(formData));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    throw new ResourceUnprocessableEntity("Please check your form", errors);
  }

  return result;
}
