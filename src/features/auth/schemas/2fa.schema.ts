import z from "zod";

export const twoFaScopeSchema = z.object({ scope: z.enum(["CHANGE_EMAIL", "CHANGE_PASSWORD"]) });
export type TwoFaScopeSchema = z.infer<typeof twoFaScopeSchema>;

export const twoFaOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, { message: "OTP must be a 6-digit numeric code" }),
});

export type TwoFaOtpSchema = z.infer<typeof twoFaOtpSchema>;

export const twoFaSchema = z.object({
  scope: twoFaScopeSchema.shape.scope,
  otp: twoFaOtpSchema.shape.otp,
});

export type TwoFaSchema = z.infer<typeof twoFaSchema>;

interface ValidateTwoFaForm {
  input: unknown;
  forEndpoint: "send" | "verify" | "status";
}

export async function validateTwoFaForm({ forEndpoint, input }: ValidateTwoFaForm) {
  const schema = { send: twoFaScopeSchema, verify: twoFaSchema, status: twoFaScopeSchema };
  const result = schema[forEndpoint].safeParse(input);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return { isError: true, errors, data: null };
  }

  return { isError: false, data: result.data, errors: null };
}
