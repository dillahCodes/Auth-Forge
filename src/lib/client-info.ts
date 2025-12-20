import { ipAddress } from "@vercel/functions";

export function getClientInfo(req: Request) {
  const isDev = process.env.NODE_ENV === "development";

  const ip = isDev ? "127.0.0.1" : ipAddress(req) ?? "Unknown";
  const userAgent = req.headers.get("user-agent") ?? "Unknown";

  return { ip, userAgent };
}
