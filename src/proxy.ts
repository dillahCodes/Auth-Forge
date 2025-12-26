import { decrypt, getCookie, RefreshTokenPayload } from "@/features/auth/lib/sessions";
import { NextRequest, NextResponse } from "next/server";
import { RouterUrls } from "./routers/client-router";

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

  if (isAuthRoute && resultRefreshToken.valid) {
    return NextResponse.redirect(dashboardUrl);
  }

  if (isProtectedRoute) {
    if (resultRefreshToken.valid) return NextResponse.next();
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp)$).*)",
  ],
};
