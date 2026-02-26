import { describe, it, expect } from "vitest";
import { ApiRouters } from "@/routers/api-router";

describe("ApiRouters", () => {
  it("should have the correct ME endpoint", () => {
    expect(ApiRouters.ME).toBe("/api/auth/me");
  });

  it("should have the correct AUTH_CREDENTIALS_LOGIN endpoint", () => {
    expect(ApiRouters.AUTH_CREDENTIALS_LOGIN).toBe("/api/auth/providers/account/credentials/login");
  });

  it("should have the correct AUTH_CREDENTIALS_REGISTER endpoint", () => {
    expect(ApiRouters.AUTH_CREDENTIALS_REGISTER).toBe("/api/auth/providers/account/credentials/register");
  });

  it("should have the correct LOGOUT endpoint", () => {
    expect(ApiRouters.LOGOUT).toBe("/api/auth/providers/account/logout");
  });

  it("should have the correct SESSIONS endpoint", () => {
    expect(ApiRouters.SESSIONS).toBe("/api/auth/sessions");
  });

  it("should have the correct TWOFA_SEND endpoint", () => {
    expect(ApiRouters.TWOFA_SEND).toBe("/api/auth/2fa/send");
  });

  it("should have the correct TWOFA_VERIFY endpoint", () => {
    expect(ApiRouters.TWOFA_VERIFY).toBe("/api/auth/2fa/verify");
  });

  it("should have the correct CHANGE_EMAIL_REQUEST endpoint", () => {
    expect(ApiRouters.CHANGE_EMAIL_REQUEST).toBe("/api/auth/change-profile/email/request");
  });

  it("should have the correct FORGOT_PASSWORD_SEND endpoint", () => {
    expect(ApiRouters.FORGOT_PASSWORD_SEND).toBe("/api/auth/forgot-password/send");
  });

  it("should have the correct REVERT_ACCOUNT_EMAIL_CHANGE endpoint", () => {
    expect(ApiRouters.REVERT_ACCOUNT_EMAIL_CHANGE).toBe("/api/auth/revert-account/email-change");
  });

  it("all routes should start with /api/auth", () => {
    const values = Object.values(ApiRouters);
    values.forEach((value) => {
      expect(value).toMatch(/^\/api\/auth/);
    });
  });
});
