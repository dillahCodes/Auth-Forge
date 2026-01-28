import z from "zod";

export const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .trim(),
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
