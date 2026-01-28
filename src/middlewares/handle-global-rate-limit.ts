import { getClientInfo } from "@/shared/lib/client-info";
import { rateLimiterTokenBucket } from "@/shared/lib/redis/rate-limiter-token-bucket";
import { HttpStatusCode } from "@/shared/types/response";
import { NextRequest, NextResponse } from "next/server";

// DOC: Handle rate limiting for non-auth routes
export async function handleGlobalRateLimit(
  req: NextRequest
): Promise<NextResponse | null> {
  const { vercelTlsFingerprint } = getClientInfo(req);
  const path = req.nextUrl.pathname;

  const key = `path:${path}:fg:${vercelTlsFingerprint}`;
  const rateLimitConfig = { bucketCapacity: 15, refillRatePerSecond: 1, key };
  const rateLimit = await rateLimiterTokenBucket(rateLimitConfig);

  if (!rateLimit.isAllowed) {
    return new NextResponse(null, { status: HttpStatusCode.TOO_MANY_REQUESTS });
  }

  return null;
}
