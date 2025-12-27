import { UAParser } from "ua-parser-js";

export function parseDevice(userAgent?: string | null): string {
  if (!userAgent) return "Unknown Device";

  const parser = new UAParser(userAgent);
  const deviceType = parser.getDevice().type ?? "Unknown Device";
  const os = parser.getOS().name ?? "Unknown OS";
  const browser = parser.getBrowser().name ?? "Unknown Browser";

  const isDesktop = os === "Windows" || os === "Linux" || os === "Mac OS";
  const device = deviceType ?? (isDesktop ? "Desktop" : "Unknown Device");

  return `${device} · ${os} · ${browser}`;
}
