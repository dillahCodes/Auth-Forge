import { describe, it, expect } from "vitest";
import {
  AuthInvalidCredentials,
  AuthRequiredEmailVerification,
  ValidationFailed,
  AuthUnauthorized,
  AuthTokenExpired,
  AuthSessionRevoked,
  TwoFaRequired,
  TwoFaInvalidScope,
  GoogleAuthMissingCode,
} from "@/shared/errors/auth-error";
import { AppError } from "@/shared/errors/app-error";
import { ErrorCode, HttpStatusCode } from "@/shared/types/response";

describe("AuthInvalidCredentials", () => {
  it("should be an instance of AppError", () => {
    expect(new AuthInvalidCredentials()).toBeInstanceOf(AppError);
  });

  it("should have UNAUTHORIZED status", () => {
    expect(new AuthInvalidCredentials().status).toBe(HttpStatusCode.UNAUTHORIZED);
  });

  it("should have AUTH_INVALID_CREDENTIALS messageCode", () => {
    expect(new AuthInvalidCredentials().messageCode).toBe(ErrorCode.AUTH_INVALID_CREDENTIALS);
  });

  it("should accept optional errors", () => {
    const errors = { email: ["Invalid"] };
    expect(new AuthInvalidCredentials(errors).errors).toEqual(errors);
  });
});

describe("AuthRequiredEmailVerification", () => {
  it("should have UNAUTHORIZED status", () => {
    expect(new AuthRequiredEmailVerification().status).toBe(HttpStatusCode.UNAUTHORIZED);
  });

  it("should use default message", () => {
    expect(new AuthRequiredEmailVerification().message).toBe("Please verify your email first");
  });

  it("should use custom message", () => {
    expect(new AuthRequiredEmailVerification("Custom msg").message).toBe("Custom msg");
  });
});

describe("ValidationFailed", () => {
  it("should have UNPROCESSABLE_ENTITY status", () => {
    expect(new ValidationFailed({ field: ["err"] }).status).toBe(HttpStatusCode.UNPROCESSABLE_ENTITY);
  });

  it("should have VALIDATION_FAILED messageCode", () => {
    expect(new ValidationFailed({ field: ["err"] }).messageCode).toBe(ErrorCode.VALIDATION_FAILED);
  });
});

describe("AuthUnauthorized", () => {
  it("should have UNAUTHORIZED status", () => {
    expect(new AuthUnauthorized().status).toBe(HttpStatusCode.UNAUTHORIZED);
  });

  it("should use default message", () => {
    expect(new AuthUnauthorized().message).toBe("Unauthorized, please login first");
  });
});

describe("AuthTokenExpired", () => {
  it("should have UNAUTHORIZED status", () => {
    expect(new AuthTokenExpired().status).toBe(HttpStatusCode.UNAUTHORIZED);
  });

  it("should have AUTH_TOKEN_EXPIRED messageCode", () => {
    expect(new AuthTokenExpired().messageCode).toBe(ErrorCode.AUTH_TOKEN_EXPIRED);
  });
});

describe("AuthSessionRevoked", () => {
  it("should have UNAUTHORIZED status", () => {
    expect(new AuthSessionRevoked().status).toBe(HttpStatusCode.UNAUTHORIZED);
  });

  it("should include 'Session revoked' in message", () => {
    expect(new AuthSessionRevoked().message).toContain("Session revoked");
  });
});

describe("TwoFaRequired", () => {
  it("should have UNAUTHORIZED status", () => {
    expect(new TwoFaRequired().status).toBe(HttpStatusCode.UNAUTHORIZED);
  });

  it("should have AUTH_MISSING_2FA_TOKEN messageCode", () => {
    expect(new TwoFaRequired().messageCode).toBe(ErrorCode.AUTH_MISSING_2FA_TOKEN);
  });
});

describe("TwoFaInvalidScope", () => {
  it("should have FORBIDDEN status", () => {
    expect(new TwoFaInvalidScope().status).toBe(HttpStatusCode.FORBIDDEN);
  });
});

describe("GoogleAuthMissingCode", () => {
  it("should have BAD_REQUEST status", () => {
    expect(new GoogleAuthMissingCode().status).toBe(HttpStatusCode.BAD_REQUEST);
  });

  it("should have AUTH_GOOGLE_MISSING_CODE messageCode", () => {
    expect(new GoogleAuthMissingCode().messageCode).toBe(ErrorCode.AUTH_GOOGLE_MISSING_CODE);
  });
});
