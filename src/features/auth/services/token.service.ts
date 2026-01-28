import "server-only";
import { errors, JWTPayload, jwtVerify, SignJWT } from "jose";
import { expiresInMiliseconds } from "@/shared/utils/expires-in-miliseconds";

export interface RefreshTokenPayload extends JWTPayload {
  sessionId: string;
}

export interface AccessTokenPayload extends JWTPayload {
  userId: string;
  sessionId: string;
}

const SESSION_SECRET = process.env.SESSION_SECRET!;
const SECRET = new TextEncoder().encode(SESSION_SECRET);

// DOC: for production
// export const ACCESS_TOKEN_EXPIRES_SECONDS = 15 * 60;
// export const REFRESH_TOKEN_EXPIRES_SECONDS = 60 * 60 * 24 * 7;

// DOC: for development
export const ACCESS_TOKEN_EXPIRES_SECONDS = 1 * 60;
export const REFRESH_TOKEN_EXPIRES_SECONDS = 10 * 60;

export const TokenService = {
  // DOC: Sign access token
  signAccessToken(payload: AccessTokenPayload) {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expiresInMiliseconds(ACCESS_TOKEN_EXPIRES_SECONDS))
      .sign(SECRET);
  },

  // DOC: Sign refresh token
  signRefreshToken(payload: RefreshTokenPayload) {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expiresInMiliseconds(REFRESH_TOKEN_EXPIRES_SECONDS))
      .sign(SECRET);
  },

  // DOC: Verify and decrypt JWT token
  async verify<T extends JWTPayload>(token?: string) {
    if (!token) return { valid: false as const, reason: "invalid" };

    try {
      const { payload } = await jwtVerify(token, SECRET);
      return { valid: true as const, payload: payload as T };
    } catch (err) {
      if (err instanceof errors.JWTExpired) return { valid: false as const, reason: "expired" };
      return { valid: false as const, reason: "invalid" };
    }
  },
};
