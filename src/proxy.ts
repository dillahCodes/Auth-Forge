import { decrypt, getCookie, RefreshTokenPayload } from "@/features/auth/lib/sessions";
import { NextRequest, NextResponse } from "next/server";
import { RouterUrls } from "./routers/client-router";
import { getClientInfo } from "./lib/client-info";
import { rateLimiterTokenBucket } from "./lib/redis/rate-limiter-token-bucket";
import { HttpStatusCode } from "./types/response";

const protectedRoutes = [RouterUrls.PROFILE];
const authRoutes = [RouterUrls.LOGIN, RouterUrls.REGISTER];

// DOC: Handle redirect logic for login/register vs dashboard (auth routing)
async function handleAuthRouting(
  req: NextRequest,
  refreshTokenValid: boolean
): Promise<NextResponse | null> {
  const path = req.nextUrl.pathname as RouterUrls;

  if (!authRoutes.includes(path)) return null;
  if (!refreshTokenValid) return null;

  const dashboardUrl = new URL(RouterUrls.PROFILE, req.url);
  return NextResponse.redirect(dashboardUrl);
}

// DOC:Handle authentication requirement for protected routes
async function handleAuthProtection(
  req: NextRequest,
  refreshTokenValid: boolean
): Promise<NextResponse | null> {
  const path = req.nextUrl.pathname as RouterUrls;

  if (!protectedRoutes.includes(path)) return null;
  if (refreshTokenValid) return NextResponse.next();

  const loginUrl = new URL(RouterUrls.LOGIN, req.url);
  return NextResponse.redirect(loginUrl);
}

// DOC: Handle rate limiting for non-auth routes
async function handleRateLimiting(req: NextRequest): Promise<NextResponse | null> {
  const { ip, userAgent, vercelTlsFingerprint } = getClientInfo(req);
  const path = req.nextUrl.pathname as RouterUrls;

  const limiterKey = `ip:${ip}:ua:${userAgent}:path:${path}:fg:${vercelTlsFingerprint}`;
  const rateLimit = await rateLimiterTokenBucket({
    key: limiterKey,
    bucketCapacity: 5,
    refillRatePerSecond: 1,
  });

  if (!rateLimit.isAllowed) {
    return new NextResponse(null, { status: HttpStatusCode.TOO_MANY_REQUESTS });
  }

  return null;
}

// DOC Main middleware entry
export default async function middleware(req: NextRequest) {
  const refreshToken = getCookie(req, "refresh_token");
  const decryptResult = await decrypt<RefreshTokenPayload>(refreshToken);
  const refreshTokenValid = decryptResult.valid;

  // const rateLimitResult = await handleRateLimiting(req);
  // if (rateLimitResult) return rateLimitResult;

  const authRoutingResult = await handleAuthRouting(req, refreshTokenValid);
  if (authRoutingResult) return authRoutingResult;

  const authProtectionResult = await handleAuthProtection(req, refreshTokenValid);
  if (authProtectionResult) return authProtectionResult;

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp)$).*)",
  ],
};
