import { describe, it, expect } from "vitest";
import {
  verifyEmailOtpSchema,
  validateOtpVerifyEmail,
} from "@/features/auth/schemas/verify-email.schema";

describe("verifyEmailOtpSchema", () => {
  it("should pass with a valid 6-digit numeric OTP", () => {
    expect(verifyEmailOtpSchema.safeParse({ otp: "123456" }).success).toBe(true);
  });

  it("should fail with a 5-digit OTP", () => {
    expect(verifyEmailOtpSchema.safeParse({ otp: "12345" }).success).toBe(false);
  });

  it("should fail with a 7-digit OTP", () => {
    expect(verifyEmailOtpSchema.safeParse({ otp: "1234567" }).success).toBe(false);
  });

  it("should fail with non-numeric OTP", () => {
    expect(verifyEmailOtpSchema.safeParse({ otp: "abcdef" }).success).toBe(false);
  });

  it("should trim whitespace before validating", () => {
    expect(verifyEmailOtpSchema.safeParse({ otp: "  123456  " }).success).toBe(true);
  });
});

describe("validateOtpVerifyEmail", () => {
  it("should return isError false for valid OTP", async () => {
    const result = await validateOtpVerifyEmail({ otp: "654321" });
    expect(result.isError).toBe(false);
    expect(result.data).toEqual({ otp: "654321" });
  });

  it("should return isError true for invalid OTP", async () => {
    const result = await validateOtpVerifyEmail({ otp: "abc" });
    expect(result.isError).toBe(true);
    expect(result.errors).toBeDefined();
  });
});
