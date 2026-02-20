import { refineEmailDomain, refineEmailHumanLike } from "@/shared/utils/refine-email";
import z from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(10, { message: "Name must be at least 10 characters long" })
      .max(20, { message: "Name must be at most 20 characters long" }),

    email: z
      .email({ message: "Invalid email address" })
      .trim()
      .max(255, { message: "Email must be at most 255 characters long" })
      .refine(refineEmailHumanLike, { message: "Email looks invalid" })
      .refine(refineEmailDomain, { message: "Invalid email domain" }),

    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim(),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword", "password"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;

export async function validateRegisterForm(inout: unknown) {
  const parsed = registerSchema.safeParse(inout);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return { isError: true, errors, data: null };
  }

  return { isError: false, errors: null, data: parsed.data };
}
