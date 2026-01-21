import axios from "axios";
import axiosRetry, { IAxiosRetryConfig } from "axios-retry";
import { handleInterceptorsResponError } from "./interceptors";
import { retryCondition } from "./retry";

// DOC: for fetching data in Frontend (MAIN INSTANCE)
export const axiosInstance = axios.create({
  baseURL: "/",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
  withCredentials: true,
});

// DOC: only for fetching data in retry function
export const axiosRetryInstance = axios.create({
  baseURL: "/",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
  withCredentials: true,
});

// DOC: retry config
const axiosRetryConfig: IAxiosRetryConfig = {
  retries: 1,
  retryDelay: (retryCount: number) => retryCount * 500,
  retryCondition,
};

/**
 * DOC:
 * - Axios Interceptors handle side effects during request/response lifecycles.
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  handleInterceptorsResponError
);
axiosRetryInstance.interceptors.response.use(
  (response) => response,
  handleInterceptorsResponError
);

axiosRetry(axiosInstance, axiosRetryConfig);
