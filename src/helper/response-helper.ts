import { ApiResponse } from "@/types/response";
import { AxiosError } from "axios";
import { NextResponse } from "next/server";

export class AppError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.errors = errors;
  }
}

export class AuthError extends AppError {
  constructor(message = "Unauthorized", status = 401) {
    super(message, status);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string, errors?: Record<string, string[]>) {
    super(message, 400, errors);
  }
}

export function errorResponse(error: AppError): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      isSuccess: false,
      message: error.message,
      data: null,
      errors: error.errors ?? null,
    },
    { status: error.status }
  );
}

export function internalServerError(error: unknown): NextResponse<ApiResponse<null>> {
  console.error("INTERNAL SERVER ERROR:", error);

  return NextResponse.json(
    {
      isSuccess: false,
      message: "Internal Server Error. Please try again later.",
      data: null,
      errors: process.env.NODE_ENV === "development" ? { system: [String(error)] } : null,
    },
    { status: 500 }
  );
}

export function sendSuccess<T>(
  data: T,
  message: string = "Success"
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    { isSuccess: true, message, data, errors: null },
    { status: 200 }
  );
}

export function badRequest(
  message: string,
  errors?: Record<string, string[]>
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    { isSuccess: false, message, data: null, errors: errors || null },
    { status: 400 }
  );
}

export function unauthorized(
  message: string = "Unauthorized access",
  errors?: Record<string, string[]>
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      isSuccess: false,
      message,
      data: null,
      errors: errors || null,
    },
    { status: 401 }
  );
}

export function serverError(error: unknown): NextResponse<ApiResponse<null>> {
  console.error("SERVER ERROR:", error);
  return NextResponse.json(
    {
      isSuccess: false,
      message: "Internal Server Error. Please try again later.",
      data: null,
      errors: process.env.NODE_ENV === "development" ? { system: [String(error)] } : null,
    },
    { status: 500 }
  );
}

export function getFieldError(
  error: AxiosError<ApiResponse>,
  field: string
): string | undefined {
  return error.response?.data?.errors?.[field]?.[0];
}
