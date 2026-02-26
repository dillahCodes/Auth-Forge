import { describe, it, expect } from "vitest";
import {
  forgotPasswordEmailSchema,
  forgotPasswordSchema,
  validateForgotPasswordForm,
} from "@/features/auth/schemas/forgot-password.schema";

describe("forgotPasswordEmailSchema", () => {
  it("should pass with a valid email", () => {
    expect(forgotPasswordEmailSchema.safeParse({ email: "johndoe@gmail.com" }).success).toBe(true);
  });

  it("should fail with an invalid email", () => {
    expect(forgotPasswordEmailSchema.safeParse({ email: "not-an-email" }).success).toBe(false);
  });

  it("should fail with a disallowed email domain", () => {
    expect(forgotPasswordEmailSchema.safeParse({ email: "user@notallowed.xyz" }).success).toBe(false);
  });
});

describe("forgotPasswordSchema", () => {
  const valid = {
    token: "550e8400-e29b-41d4-a716-446655440000",
    email: "johndoe@gmail.com",
    password: "newpassword",
    confirmPassword: "newpassword",
  };

  it("should pass with valid data", () => {
    expect(forgotPasswordSchema.safeParse(valid).success).toBe(true);
  });

  it("should fail when passwords do not match", () => {
    expect(forgotPasswordSchema.safeParse({ ...valid, confirmPassword: "different12" }).success).toBe(false);
  });

  it("should fail with invalid UUID token", () => {
    expect(forgotPasswordSchema.safeParse({ ...valid, token: "not-a-uuid" }).success).toBe(false);
  });

  it("should fail when password is shorter than 8 chars", () => {
    expect(forgotPasswordSchema.safeParse({ ...valid, password: "short", confirmPassword: "short" }).success).toBe(false);
  });
});

describe("validateForgotPasswordForm", () => {
  it("returns isError false for valid send input", async () => {
    const result = await validateForgotPasswordForm({ forEndpoint: "send", input: { email: "johndoe@gmail.com" } });
    expect(result.isError).toBe(false);
  });

  it("returns isError true for invalid send input", async () => {
    const result = await validateForgotPasswordForm({ forEndpoint: "send", input: { email: "bad" } });
    expect(result.isError).toBe(true);
  });

  it("returns isError false for valid verify input", async () => {
    const result = await validateForgotPasswordForm({
      forEndpoint: "verify",
      input: {
        token: "550e8400-e29b-41d4-a716-446655440000",
        email: "johndoe@gmail.com",
        password: "newpassword",
        confirmPassword: "newpassword",
      },
    });
    expect(result.isError).toBe(false);
  });
});
