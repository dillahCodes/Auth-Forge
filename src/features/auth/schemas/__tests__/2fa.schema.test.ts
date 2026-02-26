import { describe, it, expect } from "vitest";
import {
  twoFaScopeSchema,
  twoFaOtpSchema,
  twoFaSchema,
  validateTwoFaForm,
} from "@/features/auth/schemas/2fa.schema";

describe("twoFaScopeSchema", () => {
  it("should pass for valid scope CHANGE_EMAIL", () => {
    expect(twoFaScopeSchema.safeParse({ scope: "CHANGE_EMAIL" }).success).toBe(true);
  });

  it("should pass for valid scope TOGGLE_GOOGLE_CONNECTION", () => {
    expect(twoFaScopeSchema.safeParse({ scope: "TOGGLE_GOOGLE_CONNECTION" }).success).toBe(true);
  });

  it("should fail for invalid scope", () => {
    expect(twoFaScopeSchema.safeParse({ scope: "UNKNOWN_SCOPE" }).success).toBe(false);
  });
});

describe("twoFaOtpSchema", () => {
  it("should pass for a valid 6-digit OTP", () => {
    expect(twoFaOtpSchema.safeParse({ otp: "123456" }).success).toBe(true);
  });

  it("should fail for OTP shorter than 6 digits", () => {
    expect(twoFaOtpSchema.safeParse({ otp: "12345" }).success).toBe(false);
  });

  it("should fail for alpha OTP", () => {
    expect(twoFaOtpSchema.safeParse({ otp: "abcdef" }).success).toBe(false);
  });

  it("should fail for OTP longer than 6 digits", () => {
    expect(twoFaOtpSchema.safeParse({ otp: "1234567" }).success).toBe(false);
  });
});

describe("twoFaSchema", () => {
  it("should pass with valid scope and OTP", () => {
    expect(twoFaSchema.safeParse({ scope: "CHANGE_PASSWORD", otp: "654321" }).success).toBe(true);
  });

  it("should fail with invalid OTP", () => {
    expect(twoFaSchema.safeParse({ scope: "CHANGE_PASSWORD", otp: "abc" }).success).toBe(false);
  });
});

describe("validateTwoFaForm", () => {
  it("should return isError false for valid send input", async () => {
    const result = await validateTwoFaForm({ forEndpoint: "send", input: { scope: "CHANGE_EMAIL" } });
    expect(result.isError).toBe(false);
  });

  it("should return isError true for invalid send input", async () => {
    const result = await validateTwoFaForm({ forEndpoint: "send", input: { scope: "INVALID" } });
    expect(result.isError).toBe(true);
  });

  it("should return isError false for valid verify input", async () => {
    const result = await validateTwoFaForm({
      forEndpoint: "verify",
      input: { scope: "CHANGE_EMAIL", otp: "123456" },
    });
    expect(result.isError).toBe(false);
  });
});
