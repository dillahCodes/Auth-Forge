import { ErrorCode, HttpStatusCode } from "@/types/response";

export class AppError extends Error {
  readonly status: HttpStatusCode;
  readonly messageCode: ErrorCode;
  readonly errors?: Record<string, string[]>;

  constructor(
    message: string,
    status: HttpStatusCode,
    messageCode: ErrorCode,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.messageCode = messageCode;
    this.errors = errors;
  }
}
