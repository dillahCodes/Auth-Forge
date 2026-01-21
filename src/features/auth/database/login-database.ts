import { REFRESH_TOKEN_EXPIRES_SECONDS } from "@/features/auth/lib/sessions";
import { expiresInMiliseconds } from "@/helper/expires-in-miliseconds";
import { prisma } from "@/lib/prisma";
import "server-only";

interface CreateSession {
  sessionId: string;
  userId: string;
  refreshToken: string;

  ip?: string | null;
  userAgent?: string | null;
  asn?: number | null;
  isp?: string | null;

  continent?: string | null;
  country?: string | null;
  countryRegion?: string | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export async function createSession({
  sessionId,
  userId,
  refreshToken,
  ip,
  city,
  country,
  countryRegion,
  continent,
  userAgent,
  latitude,
  longitude,
  asn,
  isp,
}: CreateSession) {
  const expiresAt = expiresInMiliseconds(REFRESH_TOKEN_EXPIRES_SECONDS);

  return prisma.sessions.create({
    data: {
      id: sessionId,
      userId,
      refreshToken,
      ipAddress: ip,
      userAgent,
      expiresAt,
      city,
      country,
      countryRegion,
      latitude,
      longitude,
      continent,
      asn,
      isp,
    },
  });
}

export async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, password: true, name: true, email: true, verifiedAt: true },
  });

  return user;
}

export async function getUserByUserId(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, verifiedAt: true },
  });
  return user;
}
