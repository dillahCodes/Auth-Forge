import { ClientRouters } from "@/routers/client-router";

//DOC: indicates that a session-revoked redirect has been triggered
let hasTriggeredSessionRevokedRedirect = false;

//DOC: shared blocking promise for all inflight requests
let sessionRevokedBlocker: Promise<never> | null = null;

export function handleSessionRevoked(): Promise<never> {
  if (hasTriggeredSessionRevokedRedirect && sessionRevokedBlocker) {
    return sessionRevokedBlocker;
  }

  hasTriggeredSessionRevokedRedirect = true;
  window.location.href = ClientRouters.SESSION_REVOKED;

  sessionRevokedBlocker = new Promise<never>(() => {});
  return sessionRevokedBlocker;
}
