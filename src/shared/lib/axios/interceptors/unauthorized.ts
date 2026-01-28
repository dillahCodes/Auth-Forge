import { ClientRouters } from "@/routers/client-router";

// DOC: indicates that a session-unauthorized redirect has been triggered
let hasTriggeredUnauthorizedRedirect = false;

// DOC: shared blocking promise for all inflight requests
let unauthorizedBlocker: Promise<never> | null = null;

export function handleUnauthorized(): Promise<never> {
  if (hasTriggeredUnauthorizedRedirect && unauthorizedBlocker) {
    return unauthorizedBlocker;
  }

  hasTriggeredUnauthorizedRedirect = true;
  window.location.href = ClientRouters.UNAUTHORIZED;

  unauthorizedBlocker = new Promise<never>(() => {});
  return unauthorizedBlocker;
}
