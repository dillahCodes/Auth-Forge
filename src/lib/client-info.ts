export function getClientInfo(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : null;
  const userAgent = req.headers.get("user-agent") ?? null;

  return { ip, userAgent };
}
