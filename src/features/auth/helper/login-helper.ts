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

// DOC: upsert refresh token
async function upsertRefreshToken({
  sessionId,
  refreshToken,
  userId,
  ip,
  city,
  country,
  countryRegion,
  region,
  userAgent,
}: UpsertSession) {
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MILLISECONDS);

  return prisma.sessions.upsert({
    where: {
      userId_userAgent_ipAddress: {
        userId,
        userAgent,
        ipAddress: ip,
      },
    },
    update: {
      refreshToken,
      expiresAt,
      revoked: false,
      city,
      country,
      countryRegion,
      region,
    },
    create: {
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
    },
  });
}

type GetSessionId = Pick<UpsertSession, "userId" | "userAgent" | "ip">;

// DOC: get existing session id
async function getSessionId({ ip, userAgent, userId }: GetSessionId) {
  const session = await prisma.sessions.findUnique({
    where: {
      userId_userAgent_ipAddress: {
        userId,
        userAgent,
        ipAddress: ip,
      },
    },
    select: { id: true },
  });
  return session ? session.id : null;
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

export {
  validateLoginForm,
  validateUser,
  setAuthCookies,
  upsertRefreshToken,
  getSessionId,
};
