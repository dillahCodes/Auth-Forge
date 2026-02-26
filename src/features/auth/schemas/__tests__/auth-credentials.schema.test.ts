import { describe, it, expect } from "vitest";
import {
  loginSchema,
  registerSchema,
  connectCredentialsSchema,
  validateAuthCredentialsForm,
} from "@/features/auth/schemas/auth-credentials.schema";

describe("loginSchema", () => {
  it("should pass with valid email and password", () => {
    const result = loginSchema.safeParse({ email: "johndoe@gmail.com", password: "password123" });
    expect(result.success).toBe(true);
  });

  it("should fail with invalid email", () => {
    const result = loginSchema.safeParse({ email: "not-an-email", password: "password123" });
    expect(result.success).toBe(false);
  });

  it("should fail with password shorter than 8 chars", () => {
    const result = loginSchema.safeParse({ email: "johndoe@gmail.com", password: "short" });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  const valid = {
    name: "John Doe New",
    email: "johndoe@gmail.com",
    password: "password123",
    confirmPassword: "password123",
  };

  it("should pass with valid data", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("should fail when name is shorter than 10 chars", () => {
    expect(registerSchema.safeParse({ ...valid, name: "John" }).success).toBe(false);
  });

  it("should fail when name is longer than 20 chars", () => {
    expect(registerSchema.safeParse({ ...valid, name: "a".repeat(21) }).success).toBe(false);
  });

  it("should fail when passwords do not match", () => {
    const result = registerSchema.safeParse({ ...valid, confirmPassword: "different99" });
    expect(result.success).toBe(false);
  });

  it("should fail with invalid email domain", () => {
    const result = registerSchema.safeParse({ ...valid, email: "test@unknown-domain.xyz" });
    expect(result.success).toBe(false);
  });
});

describe("connectCredentialsSchema", () => {
  it("should pass for UNBIND mode without passwords", () => {
    const result = connectCredentialsSchema.safeParse({ mode: "UNBIND" });
    expect(result.success).toBe(true);
  });

  it("should pass for BIND mode with matching passwords", () => {
    const result = connectCredentialsSchema.safeParse({
      mode: "BIND",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("should fail for BIND mode with missing password", () => {
    const result = connectCredentialsSchema.safeParse({ mode: "BIND", confirmPassword: "password123" });
    expect(result.success).toBe(false);
  });

  it("should fail for invalid mode", () => {
    const result = connectCredentialsSchema.safeParse({ mode: "INVALID" });
    expect(result.success).toBe(false);
  });
});

describe("validateAuthCredentialsForm", () => {
  it("should return isError false for valid LOGIN input", async () => {
    const result = await validateAuthCredentialsForm({
      forEndpoint: "LOGIN",
      input: { email: "johndoe@gmail.com", password: "password123" },
    });
    expect(result.isError).toBe(false);
    expect(result.data).toBeDefined();
  });

  it("should return isError true for invalid LOGIN input", async () => {
    const result = await validateAuthCredentialsForm({
      forEndpoint: "LOGIN",
      input: { email: "bad", password: "x" },
    });
    expect(result.isError).toBe(true);
    expect(result.errors).toBeDefined();
  });

  it("should return isError false for valid REGISTER input", async () => {
    const result = await validateAuthCredentialsForm({
      forEndpoint: "REGISTER",
      input: {
        name: "John Doe New",
        email: "johndoe@gmail.com",
        password: "password123",
        confirmPassword: "password123",
      },
    });
    expect(result.isError).toBe(false);
  });
});
