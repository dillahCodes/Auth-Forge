import "server-only";
import {
  ACCESS_TOKEN_EXPIRES_SECONDS,
  REFRESH_TOKEN_EXPIRES_SECONDS,
} from "@/features/auth/lib/sessions";
import { loginSchema } from "@/features/auth/schemas/loginSchema";
import { expiresInMiliseconds } from "@/helper/expires-in-miliseconds";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

interface CreateSession {
  sessionId: string;
  userId: string;
  refreshToken: string;
  ip: string | null;
  city: string | null;
  country: string | null;
  countryRegion: string | null;
  region: string | null;
  continent: string | null;
  latitude: number | null;
  longitude: number | null;
  userAgent: string;
}

// DOC: validate login form
async function validateLoginForm(req: Request) {
  const formData = await req.formData();
  return loginSchema.safeParse(Object.fromEntries(formData));
}

// DOC: validate user
async function validateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  return isValid ? user : null;
}

export async function createSession({
  sessionId,
  userId,
  refreshToken,
  ip,
  city,
  country,
  countryRegion,
  region,
  continent,
  userAgent,
  latitude,
  longitude,
}: CreateSession) {
  const expiresAt = expiresInMiliseconds(ACCESS_TOKEN_EXPIRES_SECONDS);

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
      region,
      latitude,
      longitude,
      continent,
    },
  });
}

// DOC: set auth cookies in client browser
function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
) {
  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_TOKEN_EXPIRES_SECONDS,
  });

  response.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_TOKEN_EXPIRES_SECONDS,
  });
}

export { setAuthCookies, validateLoginForm, validateUser };
