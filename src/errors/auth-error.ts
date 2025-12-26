import { ErrorCode, HttpStatusCode } from "@/types/response";
import { AppError } from "./app-error";

export class AuthInvalidCredentials extends AppError {
  constructor(errors?: Record<string, string[]>) {
    super(
      "Invalid email or password",
      HttpStatusCode.UNAUTHORIZED,
      ErrorCode.AUTH_INVALID_CREDENTIALS,
      errors
    );
  }
}

export class AuthUnauthorized extends AppError {
  constructor(message = "Unauthorized, please login first") {
    super(message, HttpStatusCode.UNAUTHORIZED, ErrorCode.AUTH_UNAUTHORIZED);
  }
}

export class AuthInvalidToken extends AppError {
  constructor(message = "Invalid token, please login again") {
    super(message, HttpStatusCode.UNAUTHORIZED, ErrorCode.AUTH_INVALID_TOKEN);
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
