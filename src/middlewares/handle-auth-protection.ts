import { ClientPrivateRoutes, ClientRouters } from "@/routers/client-router";
import { NextRequest, NextResponse } from "next/server";

// DOC:Handle authentication requirement for protected routes
export async function handleAuthProtection(
  req: NextRequest,
  refreshToken?: string
): Promise<NextResponse | null> {
  const path = req.nextUrl.pathname as ClientRouters;

  if (!ClientPrivateRoutes.includes(path)) return null;
  if (refreshToken) return NextResponse.next();

  const loginUrl = new URL(ClientRouters.LOGIN, req.url);
  return NextResponse.redirect(loginUrl);
}
