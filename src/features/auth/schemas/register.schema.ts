import z from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(10, { message: "Name must be at least 10 characters long" })
    .max(20, { message: "Name must be at most 20 characters long" }),
  email: z.email({ message: "Invalid email address" }).trim(),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim(),
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
