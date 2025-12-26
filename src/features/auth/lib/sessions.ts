import "server-only";
import { expiresInMiliseconds } from "@/helper/expires-in-miliseconds";
import { errors, JWTPayload, jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export type DecryptResult<TPayload extends JWTPayload = JWTPayload> =
  | { valid: true; payload: TPayload }
  | { valid: false; reason: "expired" | "invalid" };

export interface RefreshTokenPayload extends JWTPayload {
  sessionId: string;
}

export interface AccessTokenPayload extends JWTPayload {
  userId: string;
  sessionId: string;
}

const SESSION_SECRET = process.env.SESSION_SECRET!;
const SECRET = new TextEncoder().encode(SESSION_SECRET);

// export const ACCESS_TOKEN_EXPIRES_SECONDS = 15 * 60; // 15 minutes
export const ACCESS_TOKEN_EXPIRES_SECONDS = 1 * 60; // FOR DEBUGGING: 1 minute
export const REFRESH_TOKEN_EXPIRES_SECONDS = 60 * 60 * 24 * 7; // 7 days
// export const REFRESH_TOKEN_EXPIRES_SECONDS = 2 * 60; // FOR DEBUGGING: 2 minutes

export async function signAccessToken({
  userId,
  sessionId,
}: {
  userId: string;
  sessionId: string;
}) {
  return new SignJWT({ userId, sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresInMiliseconds(ACCESS_TOKEN_EXPIRES_SECONDS))
    .sign(SECRET);
}

export async function signRefreshToken({ sessionId }: { sessionId: string }) {
  return new SignJWT({ sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresInMiliseconds(REFRESH_TOKEN_EXPIRES_SECONDS))
    .sign(SECRET);
}

export function getCookie(req: Request, name: string) {
  const cookieHeader = req.headers.get("cookie") || "";
  return cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`))
    ?.split("=")[1];
}

export async function deleteSession() {
  const resultCookie = await cookies();
  resultCookie.delete("access_token");
  resultCookie.delete("refresh_token");
}

export async function decrypt<TPayload extends JWTPayload = JWTPayload>(
  token?: string
): Promise<DecryptResult<TPayload>> {
  if (!token) return { valid: false, reason: "invalid" };

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return { valid: true, payload: payload as TPayload };
  } catch (error) {
    if (error instanceof errors.JWTExpired) return { valid: false, reason: "expired" };
    return { valid: false, reason: "invalid" };
  }
}
