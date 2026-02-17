import z from "zod";

const revertAccountSchema = z
  .object({
    token: z.uuid(),
    tokenId: z.uuid(),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim(),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters long" }).trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword", "password"],
  });

export const revertAccountPasswordSchema = revertAccountSchema.safeExtend({
  email: z.email({ message: "Invalid email address" }).trim(),
});

export const revertAccountEmailSchema = revertAccountSchema;

export type RevertAccountSchema = z.infer<typeof revertAccountSchema>;
export type RevertAccountPasswordSchema = z.infer<typeof revertAccountPasswordSchema>;
export type RevertAccountEmailSchema = z.infer<typeof revertAccountEmailSchema>;

export interface ValidateRevertAccountForm {
  input: unknown;
  forEndpoint: "VERIFY_REVERT_PASSWORD" | "VERIFY_REVERT_EMAIL";
}

export async function validateRevertAccountForm({ forEndpoint, input }: ValidateRevertAccountForm) {
  const schema = { VERIFY_REVERT_PASSWORD: revertAccountPasswordSchema, VERIFY_REVERT_EMAIL: revertAccountEmailSchema };
  const result = schema[forEndpoint].safeParse(input);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { isError: true, errors, data: null };
  }

  return { isError: false, data: result.data, errors: null };
}

// export async function validateRevertAccountForm({ input }: { input: unknown }) {
//   const result = revertAccountSchema.safeParse(input);

//   if (!result.success) {
//     const errors = result.error.flatten().fieldErrors;
//     return { isError: true, errors, data: null };
//   }

//   return { isError: false, data: result.data, errors: null };
// }
