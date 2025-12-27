import { ipAddress } from "@vercel/functions";

export function getClientInfo(req: Request) {
  const isDev = process.env.NODE_ENV === "development";

  const ipFromHeader = req.headers.get("x-dev-ip");
  const ip = isDev ? ipFromHeader : ipAddress(req) ?? "Unknown";
  const userAgent = req.headers.get("user-agent") ?? "Unknown";

  return { ip, userAgent };
}
