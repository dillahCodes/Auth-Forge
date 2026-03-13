export interface ClientInfo {
  ip: string | null;
  userAgent: string | null;
  vercelTlsFingerprint: string | null;
}

export function getClientInfo(req: Request): ClientInfo {
  // IP ADDRESS, DOC: https://vercel.com/docs/headers/request-headers#x-real-ip
  const realIp = req.headers.get("x-real-ip");
  const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0].trim();
  const ip = realIp ?? forwardedFor ?? null;

  // USER AGENT & JA4, DOC: https://vercel.com/docs/vercel-firewall/firewall-concepts#x-vercel-ja4-digest-preferred
  const userAgent = req.headers.get("user-agent") ?? null;
  const vercelTlsFingerprint = req.headers.get("x-vercel-ja4-digest") ?? null;

  return { ip, userAgent, vercelTlsFingerprint };
}
