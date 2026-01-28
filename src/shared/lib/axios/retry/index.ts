import { ApiResponse, ErrorCode } from "@/shared/types/response";
import { AxiosError } from "axios";
import { refreshSession } from "./refresh-session";

interface RetryExecutor {
  readonly messageCode: ErrorCode[];
  readonly executor: () => Promise<boolean>;
}

export async function retryCondition(error: AxiosError<unknown>) {
  const axiosError = error as AxiosError<ApiResponse>;
  const messageCode = axiosError.response?.data?.messageCode;

  const retryExecutor: RetryExecutor[] = [
    // you can add more messageCode in single array...
    { messageCode: [ErrorCode.AUTH_TOKEN_EXPIRED], executor: refreshSession },
    // add more retry executor...
  ];

  // DOC: check and find first matching retry executor
  const executor = retryExecutor.find(
    (e) => messageCode && e.messageCode.includes(messageCode)
  );

  // DOC: true = retry failed request, false = stop retry failed request
  if (executor) {
    const refreshed = await executor.executor();
    return refreshed;
  }

  return false; // cancel retry failed request
}
