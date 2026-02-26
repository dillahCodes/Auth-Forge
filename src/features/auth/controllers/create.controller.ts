import { AppError } from "@/shared/errors/app-error";
import { AuthSessionRevoked, AuthUnauthorized } from "@/shared/errors/auth-error";
import { ApiResponse } from "@/shared/types/response";
import { errorResponse, internalServerError } from "@/shared/utils/response-helper";
import { NextResponse } from "next/server";
import { CookieHttp } from "../http/cookie.http";

type HttpResponse<T> = NextResponse<ApiResponse<T>>;
type HttpResponseOrNull<T> = NextResponse<ApiResponse<T | null>>;

export const CreateController = {
  create<T, C = undefined>(handler: (req: Request, context: C) => Promise<HttpResponse<T> | NextResponse>) {
    return async (req: Request, context?: C): Promise<HttpResponseOrNull<T> | NextResponse> => {
      try {
        return await handler(req, context as C);
      } catch (error) {
        // DOC: check if error is auth error
        if (error instanceof AuthSessionRevoked || error instanceof AuthUnauthorized) {
          const response = errorResponse(error);
          CookieHttp.clear(response);
          return response;
        }

        // DOC: check if error is app error
        if (error instanceof AppError) return errorResponse(error);

        // DOC: return internal server error
        return internalServerError(error);
      }
    };
  },
};
