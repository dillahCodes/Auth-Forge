import { refineEmailDomain, refineEmailHumanLike } from "@/shared/utils/refine-email";
import z from "zod";

export const loginSchema = z.object({
  email: z
    .email({ message: "Invalid email address" })
    .trim()
    .refine(refineEmailHumanLike, { message: "Email looks invalid" })
    .refine(refineEmailDomain, { message: "Invalid email domain" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim(),
});

export type LoginSchema = z.infer<typeof loginSchema>;

// DOC: validate login form
export async function validateLoginForm(input: unknown) {
  const result = loginSchema.safeParse(input);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { isError: true, errors, data: null };
  }

  return { isError: false, errors: null, data: result.data };
}
