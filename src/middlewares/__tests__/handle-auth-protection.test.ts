import { describe, it, expect } from "vitest";
import { handleAuthProtection } from "@/middlewares/handle-auth-protection";
import { NextRequest } from "next/server";

function makeRequest(path: string): NextRequest {
  return new NextRequest(new URL(path, "http://localhost"));
}

describe("handleAuthProtection", () => {
  it("should return null for a public route (/login)", async () => {
    const req = makeRequest("/login");
    const result = await handleAuthProtection(req, undefined);
    expect(result).toBeNull();
  });

  it("should return null for a public route (/register)", async () => {
    const req = makeRequest("/register");
    const result = await handleAuthProtection(req, "some-token");
    expect(result).toBeNull();
  });

  it("should redirect to /login when a private route is accessed without a token", async () => {
    const req = makeRequest("/dashboard");
    const result = await handleAuthProtection(req, undefined);
    expect(result).not.toBeNull();
    expect(result?.status).toBe(307);
    expect(result?.headers.get("location")).toContain("/login");
  });

  it("should return NextResponse.next() when a private route is accessed with a token", async () => {
    const req = makeRequest("/dashboard");
    const result = await handleAuthProtection(req, "valid-refresh-token");
    expect(result).not.toBeNull();
    expect(result?.status).toBe(200);
  });

  it("should redirect to /login for /profile without token", async () => {
    const req = makeRequest("/profile");
    const result = await handleAuthProtection(req, undefined);
    expect(result?.headers.get("location")).toContain("/login");
  });

  it("should allow /profile with a token", async () => {
    const req = makeRequest("/profile");
    const result = await handleAuthProtection(req, "valid-token");
    expect(result?.status).toBe(200);
  });
});
