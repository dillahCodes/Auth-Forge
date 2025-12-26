import { ApiRouters } from "@/routers/api-router";
import { axiosRetryInstance } from "../axios";

// DOC: state will hold the refresh token request promise
let refreshPromise: Promise<void> | null = null;

// DOC: only first error requester will trigger the refresh token request
export async function refreshSession(): Promise<boolean> {
  let isOwner = false;

  try {
    if (!refreshPromise) {
      isOwner = true;
      refreshPromise = axiosRetryInstance.post(ApiRouters.SESSIONS_REFRESH);
    }

    await refreshPromise;
    return true;
  } catch {
    return false;
  } finally {
    if (isOwner) refreshPromise = null;
  }
}
