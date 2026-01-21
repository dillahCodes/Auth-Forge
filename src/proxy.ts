import { getCookie } from "@/features/auth/lib/sessions";
import { NextRequest, NextResponse } from "next/server";
import { handleAuthProtection } from "./middlewares/handle-auth-protection";
import { handleAuthRouting } from "./middlewares/handle-auth-routing";

// DOC Main middleware entry
// DOC: https://nextjs.org/docs/app/getting-started/proxy
// DOC: https://nextjs.org/docs/app/guides/authentication#optimistic-checks-with-proxy-optional
export default async function proxy(req: NextRequest) {
  const refreshToken = getCookie(req, "refresh_token");

  // const rateLimitResult = await handleGlobalRateLimit(req);
  // if (rateLimitResult) return rateLimitResult;

  const authRoutingResult = await handleAuthRouting(req, refreshToken);
  if (authRoutingResult) return authRoutingResult;

  const authProtectionResult = await handleAuthProtection(req, refreshToken);
  if (authProtectionResult) return authProtectionResult;

  return NextResponse.next();
}

//  DOC: allow middleware for all routes except static files
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp)$).*)",
  ],
};
