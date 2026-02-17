import z from "zod";

export const changeNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(10, { message: "Name must be at least 10 characters long" })
    .max(20, { message: "Name must be at most 20 characters long" }),
});

export const changeEmailSchema = z.object({
  email: z.email({ message: "Invalid email address" }).trim(),
  newEmail: z.email({ message: "Invalid email address" }).trim(),
});

export const changeEmailUpdateSchema = z.object({
  requestId: z.uuid().trim(),
  newEmail: z.email({ message: "Invalid email address" }).trim(),
});

export const changeEmailVerifySchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, { message: "otp must be a 6-digit numeric code" }),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim(),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim(),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword", "password"],
  });

export type ChangeNameSchema = z.infer<typeof changeNameSchema>;
export type ChangeEmailSchema = z.infer<typeof changeEmailSchema>;
export type ChangeEmailUpdateSchema = z.infer<typeof changeEmailUpdateSchema>;
export type ChangeEmailVerifySchema = z.infer<typeof changeEmailVerifySchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export type AccountFormForEndpoint =
  | "CHANGE_NAME"
  | "CHANGE_EMAIL"
  | "CHANGE_EMAIL_UPDATE"
  | "CHANGE_EMAIL_VERIFY"
  | "CHANGE_PASSWORD";

interface ValidateAccountForm {
  input: unknown;
  forEndpoint: AccountFormForEndpoint;
}

export async function validateAccountForm({ forEndpoint, input }: ValidateAccountForm) {
  const schema = {
    CHANGE_NAME: changeNameSchema,
    CHANGE_EMAIL: changeEmailSchema,
    CHANGE_EMAIL_UPDATE: changeEmailUpdateSchema,
    CHANGE_EMAIL_VERIFY: changeEmailVerifySchema,
    CHANGE_PASSWORD: changePasswordSchema,
  };
  const result = schema[forEndpoint].safeParse(input);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { isError: true, errors, data: null };
  }

  return { isError: false, data: result.data, errors: null };
}
