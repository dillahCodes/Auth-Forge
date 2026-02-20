import { ErrorCode, HttpStatusCode } from "@/shared/types/response";
import { AppError } from "./app-error";

export class AuthInvalidCredentials extends AppError {
  constructor(errors?: Record<string, string[]>) {
    super("Invalid email or password", HttpStatusCode.UNAUTHORIZED, ErrorCode.AUTH_INVALID_CREDENTIALS, errors);
  }
}

export class AuthRequiredEmailVerification extends AppError {
  constructor(message = "Please verify your email first") {
    super(message, HttpStatusCode.UNAUTHORIZED, ErrorCode.AUTH_REQUIRED_EMAIL_VERIFICATION);
  }
}

export class ValidationFailed extends AppError {
  constructor(errors: Record<string, string[]>, message = "Validation failed, please check your input") {
    super(message, HttpStatusCode.UNPROCESSABLE_ENTITY, ErrorCode.VALIDATION_FAILED, errors);
  }
}

export class AuthUnauthorized extends AppError {
  constructor(message = "Unauthorized, please login first") {
    super(message, HttpStatusCode.UNAUTHORIZED, ErrorCode.AUTH_UNAUTHORIZED);
  }
}

export class AuthTokenExpired extends AppError {
  constructor(message = "Token expired, please login again") {
    super(message, HttpStatusCode.UNAUTHORIZED, ErrorCode.AUTH_TOKEN_EXPIRED);
  }
}

export class AuthSessionRevoked extends AppError {
  constructor(message = "Session revoked, please login again") {
    super(message, HttpStatusCode.UNAUTHORIZED, ErrorCode.AUTH_SESSION_REVOKED);
  }
}

export class TwoFaRequired extends AppError {
  constructor(message = "Two-factor authentication required") {
    super(message, HttpStatusCode.UNAUTHORIZED, ErrorCode.AUTH_MISSING_2FA_TOKEN);
  }
}

export class TwoFaInvalidScope extends AppError {
  constructor(message = "Invalid two-factor authentication scope") {
    super(message, HttpStatusCode.FORBIDDEN, ErrorCode.AUTH_UNAUTHORIZED);
  }
}

export class GoogleAuthMissingCode extends AppError {
  constructor(message = "Missing code") {
    super(message, HttpStatusCode.BAD_REQUEST, ErrorCode.AUTH_GOOGLE_MISSING_CODE);
  }
}
