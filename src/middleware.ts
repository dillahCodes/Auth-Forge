import { decrypt } from "@/features/auth/lib/sessions";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const accessToken = (await cookies()).get("access_token")?.value;
  const session = accessToken ? await decrypt(accessToken) : null;
  const isAuthenticated = Boolean(session?.userId);

  if (protectedRoutes.includes(path) && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // if (publicRoutes.includes(path) && isAuthenticated) {
  //   return NextResponse.redirect(new URL("/dashboard", req.url));
  // }

  return NextResponse.next();
}
