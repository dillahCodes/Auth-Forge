import { ErrorCode, HttpStatusCode } from "@/types/response";
import { AppError } from "./app-error";

export class ResourceConflict extends AppError {
  constructor(message = "Resource already exists", errors?: Record<string, string[]>) {
    super(message, HttpStatusCode.CONFLICT, ErrorCode.RESOURCE_CONFLICT, errors);
  }
}

export class ResourceNotFound extends AppError {
  constructor(message = "Resource not found", errors?: Record<string, string[]>) {
    super(message, HttpStatusCode.NOT_FOUND, ErrorCode.RESOURCE_NOT_FOUND, errors);
  }
}

export class ResourceParamsInvalid extends AppError {
  constructor(
    message = "Invalid resource parameters",
    errors?: Record<string, string[]>
  ) {
    super(
      message,
      HttpStatusCode.UNPROCESSABLE_ENTITY,
      ErrorCode.VALIDATION_FAILED,
      errors
    );
  }
}

export class ToManyRequests extends AppError {
  constructor(message = "Too many requests", errors?: Record<string, string[]>) {
    super(message, HttpStatusCode.TOO_MANY_REQUESTS, ErrorCode.TOO_MANY_REQUESTS, errors);
  }
}
