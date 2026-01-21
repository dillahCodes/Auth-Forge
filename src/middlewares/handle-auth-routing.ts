import { AuthRoutes, ClientRouters } from "@/routers/client-router";
import { NextRequest, NextResponse } from "next/server";

// DOC: Handle redirect logic for login/register vs dashboard (auth routing)
export async function handleAuthRouting(
  req: NextRequest,
  refreshToken?: string
): Promise<NextResponse | null> {
  const path = req.nextUrl.pathname as ClientRouters;

  if (!AuthRoutes.includes(path)) return null;
  if (!refreshToken) return null;

  const dashboardUrl = new URL(ClientRouters.DASHBOARD, req.url);
  return NextResponse.redirect(dashboardUrl);
}
