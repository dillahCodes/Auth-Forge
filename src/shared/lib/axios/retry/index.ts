import { ApiResponse, ErrorCode } from "@/shared/types/response";
import { AxiosError } from "axios";
import { refreshSession } from "./refresh-session";

interface RetryExecutor {
  readonly messageCode: ErrorCode[];
  readonly executor: () => Promise<boolean>;
}

const RETRY_EXECUTOR: RetryExecutor[] = [
  { messageCode: [ErrorCode.AUTH_TOKEN_EXPIRED], executor: refreshSession },
  // add more retry executor...
];

export async function retryCondition(error: AxiosError<unknown>) {
  const axiosError = error as AxiosError<ApiResponse>;

  const messageCode = axiosError.response?.data?.messageCode;
  if (!messageCode) return false; // DOC: cancel retry failed request

  const executor = RETRY_EXECUTOR.find((e) => e.messageCode.includes(messageCode));

  // DOC: true = retry failed request, false = stop retry failed request
  if (executor) {
    const refreshed = await executor.executor();
    return refreshed;
  }

  return false; // DOC: cancel retry failed request
}
