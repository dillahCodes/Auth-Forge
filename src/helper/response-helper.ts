import { ApiResponse } from "@/types/response";
import { AxiosError } from "axios";
import { NextResponse } from "next/server";

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
  message: string = "Unauthorized access"
): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      isSuccess: false,
      message,
      data: null,
      errors: null,
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
