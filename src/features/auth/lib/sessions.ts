import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const SESSION_SECRET = process.env.SESSION_SECRET!;
const SECRET = new TextEncoder().encode(SESSION_SECRET);

export const ACCESS_TOKEN_EXPIRES_SECONDS = 15 * 60; // 15 minutes
export const ACCESS_TOKEN_EXPIRES_MILLISECONDS = ACCESS_TOKEN_EXPIRES_SECONDS * 1000; // 15 minutes
export const REFRESH_TOKEN_EXPIRES_SECONDS = 60 * 60 * 24 * 7; // 7 days
export const REFRESH_TOKEN_EXPIRES_MILLISECONDS = REFRESH_TOKEN_EXPIRES_SECONDS * 1000; // 7 days

export async function signAccessToken({ userId, sessionId }: { userId: string; sessionId: string }) {
  return new SignJWT({ userId, sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(SECRET);
}

export async function signRefreshToken({ sessionId }: { sessionId: string }) {
  return new SignJWT({ sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
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

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, SECRET, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    console.log("failed to verify session");
  }
}
