import z from "zod";

export const forgotPasswordSchema = z
  .object({
    token: z.uuid(),
    tokenId: z.uuid(),
    email: z.email({ message: "Invalid email address" }).trim(),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim(),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword", "password"],
  });

export type RevertAccountSchema = z.infer<typeof forgotPasswordSchema>;

export async function validateRevertAccountForm({ input }: { input: unknown }) {
  const result = forgotPasswordSchema.safeParse(input);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { isError: true, errors, data: null };
  }

  return { isError: false, data: result.data, errors: null };
}
