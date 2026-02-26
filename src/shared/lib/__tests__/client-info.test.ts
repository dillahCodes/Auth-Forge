import { describe, it, expect } from "vitest";
import { getClientInfo } from "@/shared/lib/client-info";

function makeRequest(headers: Record<string, string>): Request {
  return new Request("http://localhost/", { headers });
}

describe("getClientInfo", () => {
  it("should extract IP from x-forwarded-for header", () => {
    const req = makeRequest({ "x-forwarded-for": "192.168.1.1, 10.0.0.1" });
    const info = getClientInfo(req);
    expect(info.ip).toBe("192.168.1.1");
  });

  it("should return null IP if header is missing", () => {
    const req = makeRequest({});
    expect(getClientInfo(req).ip).toBeNull();
  });

  it("should extract user-agent", () => {
    const req = makeRequest({ "user-agent": "Mozilla/5.0" });
    expect(getClientInfo(req).userAgent).toBe("Mozilla/5.0");
  });

  it("should return null user-agent if header is missing", () => {
    const req = makeRequest({});
    expect(getClientInfo(req).userAgent).toBeNull();
  });

  it("should extract vercel TLS fingerprint", () => {
    const req = makeRequest({ "x-vercel-ja4-digest": "abc123" });
    expect(getClientInfo(req).vercelTlsFingerprint).toBe("abc123");
  });

  it("should return null fingerprint if header is missing", () => {
    const req = makeRequest({});
    expect(getClientInfo(req).vercelTlsFingerprint).toBeNull();
  });
});
