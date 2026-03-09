import { getClientInfo } from "@/shared/lib/client-info";
import { rateLimiterTokenBucket } from "@/shared/lib/redis/rate-limiter-token-bucket";
import { HttpStatusCode } from "@/shared/types/response";
import { NextRequest, NextResponse } from "next/server";

export async function handleGlobalRateLimit(req: NextRequest): Promise<NextResponse | null> {
  const { vercelTlsFingerprint, ip } = getClientInfo(req);
  const path = req.nextUrl.pathname;

  const isApiRoute = path.startsWith("/api/");
  if (!isApiRoute) return null;

  const key = `path:${path}:fg:${vercelTlsFingerprint ?? ip}`;
  const rateLimitConfig = { bucketCapacity: 15, refillRatePerSecond: 1, key };
  const rateLimit = await rateLimiterTokenBucket(rateLimitConfig);

  if (!rateLimit.isAllowed) return new NextResponse(null, { status: HttpStatusCode.TOO_MANY_REQUESTS });
  return null;
}
