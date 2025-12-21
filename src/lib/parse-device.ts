import { UAParser } from "ua-parser-js";

export function parseDevice(userAgent?: string | null): string {
  if (!userAgent) return "Unknown Device";

  const parser = new UAParser(userAgent);
  const Device = parser.getDevice().type ?? "Unknown Device";
  const os = parser.getOS().name ?? "Unknown OS";
  const browser = parser.getBrowser().name ?? "Unknown Browser";

  return `${Device} · ${os} · ${browser}`;
}
