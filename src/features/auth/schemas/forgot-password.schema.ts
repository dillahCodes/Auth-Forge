import { refineEmail } from "@/shared/utils/refine-email";
import z from "zod";

export const forgotPasswordEmailSchema = z.object({
  email: z.email({ message: "Invalid email address" }).trim().refine(refineEmail, { message: "Invalid email domain" }),
});

export const forgotPasswordSchema = z
  .object({
    token: z.uuid(),
    email: z.email({ message: "Invalid email address" }).trim(),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim(),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword", "password"],
  });

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ForgotPasswordEmailSchema = z.infer<typeof forgotPasswordEmailSchema>;

interface ValidateForgotPasswordForm {
  input: unknown;
  forEndpoint: "send" | "verify";
}

export async function validateForgotPasswordForm({ forEndpoint, input }: ValidateForgotPasswordForm) {
  const schema = { send: forgotPasswordEmailSchema, verify: forgotPasswordSchema };
  const result = schema[forEndpoint].safeParse(input);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { isError: true, errors, data: null };
  }

  return { isError: false, data: result.data, errors: null };
}
