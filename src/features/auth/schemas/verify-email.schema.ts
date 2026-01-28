import { z } from "zod";

export const verifyEmailOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, { message: "otp must be a 6-digit numeric code" }),
});

export type VerifyEmailOtpSchema = z.infer<typeof verifyEmailOtpSchema>;

export const validateOtpVerifyEmail = async (input: unknown) => {
  const res = verifyEmailOtpSchema.safeParse(input);

  if (!res.success) {
    const errors = res.error.flatten().fieldErrors;
    return { isError: true, errors, data: null };
  }

  return { isError: false, errors: null, data: res.data };
};
