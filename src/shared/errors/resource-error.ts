import { ErrorCode, HttpStatusCode } from "@/shared/types/response";
import { AppError } from "./app-error";

export class ResourceUnprocessableEntity extends AppError {
  constructor(message = "Unprocessable entity", errors?: Record<string, string[]>) {
    super(message, HttpStatusCode.UNPROCESSABLE_ENTITY, ErrorCode.VALIDATION_FAILED, errors);
  }
}

export class TooManyRequests extends AppError {
  constructor(message = "Too many requests", errors?: Record<string, string[]>) {
    super(message, HttpStatusCode.TOO_MANY_REQUESTS, ErrorCode.TOO_MANY_REQUESTS, errors);
  }
}

export class ServiceUnavailable extends AppError {
  constructor(message = "Service unavailable", errors?: Record<string, string[]>) {
    super(message, HttpStatusCode.SERVICE_UNAVAILABLE, ErrorCode.SERVICE_UNAVAILABLE, errors);
  }
}

export class NotFound extends AppError {
  constructor(message = "Not found", errors?: Record<string, string[]>) {
    super(message, HttpStatusCode.NOT_FOUND, ErrorCode.RECOURCE_NOT_FOUND, errors);
  }
}

export class ResourceConflict extends AppError {
  constructor(message = "Resource conflict", errors?: Record<string, string[]>) {
    super(message, HttpStatusCode.CONFLICT, ErrorCode.CONFLICT, errors);
  }
}

export class OperationNotAllowed extends AppError {
  constructor(message = "Operation not allowed due to current state", errors?: Record<string, string[]>) {
    super(message, HttpStatusCode.FORBIDDEN, ErrorCode.OPERATION_NOT_ALLOWED, errors);
  }
}
