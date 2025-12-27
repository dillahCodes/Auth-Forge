import { ApiResponse, ErrorCode } from "@/types/response";
import { AxiosError, InternalAxiosRequestConfig } from "axios";
import { handleSessionRevoked } from "./session-revoked";
import { handleUnauthorized } from "./unauthorized";
import { getDevMetadata, IpWhoResponse } from "./get-dev-metadata";
import shouldInjectAuthHeaders from "./should-inject-authHeaders";

interface ErrorExecutor {
  readonly messageCode: ErrorCode;
  readonly action: () => void | Promise<void>;
}

export async function handleInterceptorsError(
  error: AxiosError<unknown>
): Promise<never> {
  try {
    const axiosError = error as AxiosError<ApiResponse>;
    const messageCode = axiosError.response?.data?.messageCode;

    const errorsAction: ErrorExecutor[] = [
      // you can add more messageCode in single array...
      { messageCode: ErrorCode.AUTH_SESSION_REVOKED, action: handleSessionRevoked },
      { messageCode: ErrorCode.AUTH_UNAUTHORIZED, action: handleUnauthorized },
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


const IS_DEV = process.env.NODE_ENV === "development";

// DOC: this is function only for development because vercel function can't use in development
export async function handleRequestInterceptors(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
  console.log(config.url)
  if (!IS_DEV) return config;
  if (!shouldInjectAuthHeaders(config.url)) return config;

  const ipMeta: IpWhoResponse | null = await getDevMetadata();
  if (!ipMeta || !ipMeta.success) throw new Error('Dev metadata missing');


  const headers = config.headers;

  headers.set("x-dev-ip", ipMeta.ip);

  // DOC: https://vercel.com/docs/headers/request-headers#x-vercel-ip-continent
  headers.set("x-vercel-ip-country", ipMeta.country_code);
  headers.set("x-vercel-ip-country-region", ipMeta.region_code || null);
  headers.set("x-vercel-ip-city", ipMeta.city);
  headers.set("x-vercel-ip-continent", ipMeta.continent_code);

  headers.set("x-vercel-ip-latitude", String(ipMeta.latitude));
  headers.set("x-vercel-ip-longitude", String(ipMeta.longitude));

  return config;
}