import { z } from "zod";

export const verifyEmailOtpSchema = z.object({
  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, { message: "otp must be a 6-digit numeric code" }),
});
