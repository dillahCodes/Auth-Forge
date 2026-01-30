import { ClientRouters } from "@/routers/client-router";

// DOC: indicates that a verify-email redirect has been triggered
let hasTriggeredVerifyEmailRedirect = false;

// DOC: shared blocking promise for all inflight requests
let verifyEmailBlocker: Promise<never> | null = null;

export function handleEmailNotVerified(): Promise<never> {
  if (hasTriggeredVerifyEmailRedirect && verifyEmailBlocker) {
    return verifyEmailBlocker;
  }

  hasTriggeredVerifyEmailRedirect = true;

  const currentUrl = window.location.href;
  const verifyUrl = new URL(ClientRouters.VERIFY_EMAIL, window.location.origin);

  verifyUrl.searchParams.set("redirect", currentUrl);

  window.location.href = verifyUrl.toString();

  verifyEmailBlocker = new Promise<never>(() => {});
  return verifyEmailBlocker;
}
