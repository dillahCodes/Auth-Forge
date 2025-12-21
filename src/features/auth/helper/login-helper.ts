import { prisma } from "@/lib/prisma";
import {
  ACCESS_TOKEN_EXPIRES_SECONDS,
  REFRESH_TOKEN_EXPIRES_MILLISECONDS,
  REFRESH_TOKEN_EXPIRES_SECONDS,
} from "@/features/auth/lib/sessions";
import { loginSchema } from "@/features/auth/schemas/loginSchema";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

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

interface UpsertSession {
  sessionId: string;
  userId: string;
  refreshToken: string;
  ip: string;
  city: string;
  country: string;
  countryRegion: string;
  region: string;
  userAgent: string;
}

// DOC: create or update session (refresh token) in database
async function upsertSession({
  ip,
  refreshToken,
  userId,
  sessionId,
  userAgent,
  city,
  country,
  countryRegion,
  region,
}: UpsertSession) {
  const existing = await prisma.sessions.findFirst({
    where: { userId, userAgent, ipAddress: ip },
  });

  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MILLISECONDS);

  if (existing) {
    return prisma.sessions.update({
      where: { id: existing.id },
      data: { refreshToken, expiresAt },
    });
  }

  return prisma.sessions.create({
    data: {
      userId,
      refreshToken,
      ipAddress: ip,
      userAgent,
      expiresAt,
      id: sessionId,
      city,
      country,
      countryRegion,
      region,
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
    sameSite: "strict",
    path: "/",
    maxAge: ACCESS_TOKEN_EXPIRES_SECONDS,
  });

  response.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: REFRESH_TOKEN_EXPIRES_SECONDS,
  });
}

export { validateLoginForm, validateUser, upsertSession, setAuthCookies };
