import { NextResponse } from "next/server";
import { ACCESS_TOKEN_EXPIRES_SECONDS, REFRESH_TOKEN_EXPIRES_SECONDS } from "../services/token.service";

interface SetCookieHttp {
  response: NextResponse;
  accessToken?: string;
  refreshToken?: string;
}

export const CookieHttp = {
  // DOC: Set auth cookies in response
  set({ response, accessToken, refreshToken }: SetCookieHttp) {
    if (accessToken) {
      response.cookies.set("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: ACCESS_TOKEN_EXPIRES_SECONDS,
      });
    }

    if (refreshToken) {
      response.cookies.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: REFRESH_TOKEN_EXPIRES_SECONDS,
      });
    }
  },

  // DOC: function to get token from cookies
  getCookie(req: Request, name: string) {
    const cookieHeader = req.headers.get("cookie") || "";
    return cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${name}=`))
      ?.split("=")[1];
  },

  // DOC: Clear auth cookies
  async clear(response: NextResponse) {
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
  },
};
