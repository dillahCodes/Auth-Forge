import { AppError } from "@/errors/app-error";
import { ApiResponse, ErrorCode } from "@/types/response";
import { AxiosError } from "axios";
import { NextResponse } from "next/server";

export function errorResponse(error: AppError): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      isSuccess: false,
      message: error.message,
      messageCode: error.messageCode,
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
      messageCode: ErrorCode.INTERNAL_SERVER_ERROR,
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
    { isSuccess: true, message, data, errors: null, messageCode: null },
    { status: 200 }
  );
}

export function getFieldError(
  error: AxiosError<ApiResponse>,
  field: string
): string | undefined {
  return error.response?.data?.errors?.[field]?.[0];
}
