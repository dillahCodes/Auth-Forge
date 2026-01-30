import { ApiResponse, ErrorCode } from "@/shared/types/response";
import { AxiosError } from "axios";
import { handleSessionRevoked } from "./session-revoked";
import { handleUnauthorized } from "./unauthorized";
import { handleEmailNotVerified } from "./required-email-verification";

interface ErrorExecutor {
  readonly messageCode: ErrorCode;
  readonly action: () => void | Promise<void>;
}

export async function handleInterceptorsResponError(error: AxiosError<unknown>): Promise<never> {
  try {
    const axiosError = error as AxiosError<ApiResponse>;
    const messageCode = axiosError.response?.data?.messageCode;

    const errorsAction: ErrorExecutor[] = [
      // you can add more messageCode in single array...
      { messageCode: ErrorCode.AUTH_SESSION_REVOKED, action: handleSessionRevoked },
      { messageCode: ErrorCode.AUTH_UNAUTHORIZED, action: handleUnauthorized },
      { messageCode: ErrorCode.AUTH_REQUIRED_EMAIL_VERIFICATION, action: handleEmailNotVerified },
      // ... add more
    ];

    // check and find first matching error action
    const executor = errorsAction.find((e) => messageCode && e.messageCode === messageCode);
    if (executor) await executor.action();

    return Promise.reject(error);
  } catch (fatalError: unknown) {
    console.error("Interceptor fatal error:", fatalError);
    return Promise.reject(error);
  }
}
