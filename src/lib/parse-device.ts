import { UAParser } from "ua-parser-js";

export function parseDevice(userAgent?: string | null): string {
  if (!userAgent) return "Unknown Device";

  const parser = new UAParser(userAgent);
  const browser = parser.getBrowser().name ?? "Unknown Browser";
  const os = parser.getOS().name ?? "Unknown OS";

  return `${browser} · ${os}`;
}
