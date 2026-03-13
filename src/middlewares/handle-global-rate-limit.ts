import { getClientInfo } from "@/shared/lib/client-info";
import { rateLimiterTokenBucket } from "@/shared/lib/redis/rate-limiter-token-bucket";
import { HttpStatusCode } from "@/shared/types/response";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function handleGlobalRateLimit(req: NextRequest): Promise<NextResponse | null> {
  const { vercelTlsFingerprint, ip } = getClientInfo(req);
  const path = req.nextUrl.pathname;

  const isApiRoute = path.startsWith("/api/");
  if (!isApiRoute) return null;

  const identifier = crypto
    .createHash("sha256")
    .update(`${ip}:${vercelTlsFingerprint ?? "no-ja4"}`)
    .digest("hex");

  const key = `path:${path}:${identifier}`;
  const rateLimitConfig = { bucketCapacity: 15, refillRatePerSecond: 1, key };
  const rateLimit = await rateLimiterTokenBucket(rateLimitConfig);

  if (!rateLimit.isAllowed) return new NextResponse(null, { status: HttpStatusCode.TOO_MANY_REQUESTS });
  return null;
}
