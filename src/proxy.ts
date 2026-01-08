import { decrypt, getCookie, RefreshTokenPayload } from "@/features/auth/lib/sessions";
import { NextRequest, NextResponse } from "next/server";
import { RouterUrls } from "./routers/client-router";
import { v4 as uuidv4 } from "uuid";

const protectedRoutes = [RouterUrls.DASHBOARD];
const authRouters = [RouterUrls.LOGIN, RouterUrls.REGISTER];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname as RouterUrls;

  const isProtectedRoute = protectedRoutes.includes(path);
  const isAuthRoute = authRouters.includes(path);

  const loginUrl = new URL(RouterUrls.LOGIN, req.url);
  const dashboardUrl = new URL(RouterUrls.DASHBOARD, req.url);

  const refreshToken = getCookie(req, "refresh_token");
  const resultRefreshToken = await decrypt<RefreshTokenPayload>(refreshToken);

  const deviceId = getCookie(req, "device_id");

  if (isAuthRoute && resultRefreshToken.valid) {
    return NextResponse.redirect(dashboardUrl);
  }

  if (isProtectedRoute) {
    if (resultRefreshToken.valid && deviceId) return NextResponse.next();
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && !deviceId) {
    const newDeviceId = uuidv4();
    const res = NextResponse.next();
    res.cookies.set("device_id", newDeviceId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp)$).*)",
  ],
};
