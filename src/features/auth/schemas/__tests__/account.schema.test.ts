import { describe, it, expect } from "vitest";
import {
  changeNameSchema,
  changeEmailSchema,
  changePasswordSchema,
  changeEmailVerifySchema,
  validateAccountForm,
} from "@/features/auth/schemas/account.schema";

describe("changeNameSchema", () => {
  it("should pass with a valid name (10-20 chars)", () => {
    expect(changeNameSchema.safeParse({ name: "John Doe Now" }).success).toBe(true);
  });

  it("should fail when name is shorter than 10 chars", () => {
    expect(changeNameSchema.safeParse({ name: "Short" }).success).toBe(false);
  });

  it("should fail when name is longer than 20 chars", () => {
    expect(changeNameSchema.safeParse({ name: "a".repeat(21) }).success).toBe(false);
  });
});

describe("changeEmailSchema", () => {
  it("should pass with valid email and newEmail", () => {
    const result = changeEmailSchema.safeParse({
      email: "johndoe@gmail.com",
      newEmail: "newemail@gmail.com",
    });
    expect(result.success).toBe(true);
  });

  it("should fail with invalid email", () => {
    const result = changeEmailSchema.safeParse({
      email: "notvalid",
      newEmail: "newemail@gmail.com",
    });
    expect(result.success).toBe(false);
  });

  it("should fail with disallowed domain", () => {
    const result = changeEmailSchema.safeParse({
      email: "johndoe@gmail.com",
      newEmail: "user@notadomain.xyz",
    });
    expect(result.success).toBe(false);
  });
});

describe("changePasswordSchema", () => {
  it("should pass with valid passwords", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "oldpassword",
      password: "newpassword",
      confirmPassword: "newpassword",
    });
    expect(result.success).toBe(true);
  });

  it("should fail when new passwords do not match", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "oldpassword",
      password: "newpassword",
      confirmPassword: "different12",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when any password is too short", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "short",
      password: "newpassword",
      confirmPassword: "newpassword",
    });
    expect(result.success).toBe(false);
  });
});

describe("changeEmailVerifySchema", () => {
  it("should pass with a valid 6-digit OTP", () => {
    expect(changeEmailVerifySchema.safeParse({ otp: "123456" }).success).toBe(true);
  });

  it("should fail with non-numeric OTP", () => {
    expect(changeEmailVerifySchema.safeParse({ otp: "abcdef" }).success).toBe(false);
  });
});

describe("validateAccountForm", () => {
  it("should return isError false for valid CHANGE_NAME", async () => {
    const result = await validateAccountForm({ forEndpoint: "CHANGE_NAME", input: { name: "John Doe Now" } });
    expect(result.isError).toBe(false);
  });

  it("should return isError true for invalid CHANGE_NAME", async () => {
    const result = await validateAccountForm({ forEndpoint: "CHANGE_NAME", input: { name: "Jo" } });
    expect(result.isError).toBe(true);
    expect(result.errors).toBeDefined();
  });

  it("should return isError false for valid CHANGE_PASSWORD", async () => {
    const result = await validateAccountForm({
      forEndpoint: "CHANGE_PASSWORD",
      input: { currentPassword: "oldpassword", password: "newpassword", confirmPassword: "newpassword" },
    });
    expect(result.isError).toBe(false);
  });
});
