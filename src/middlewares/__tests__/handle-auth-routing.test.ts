import { describe, it, expect } from "vitest";
import { handleAuthRouting } from "@/middlewares/handle-auth-routing";
import { NextRequest } from "next/server";

function makeRequest(path: string): NextRequest {
  return new NextRequest(new URL(path, "http://localhost"));
}

describe("handleAuthRouting", () => {
  it("should return null for a non-auth route (/dashboard)", async () => {
    const req = makeRequest("/dashboard");
    const result = await handleAuthRouting(req, "valid-token");
    expect(result).toBeNull();
  });

  it("should return null for an auth route (/login) when no token", async () => {
    const req = makeRequest("/login");
    const result = await handleAuthRouting(req, undefined);
    expect(result).toBeNull();
  });

  it("should redirect authenticated user from /login to /dashboard", async () => {
    const req = makeRequest("/login");
    const result = await handleAuthRouting(req, "valid-token");
    expect(result).not.toBeNull();
    expect(result?.status).toBe(307);
    expect(result?.headers.get("location")).toContain("/dashboard");
  });

  it("should redirect authenticated user from /register to /dashboard", async () => {
    const req = makeRequest("/register");
    const result = await handleAuthRouting(req, "valid-token");
    expect(result?.headers.get("location")).toContain("/dashboard");
  });

  it("should redirect authenticated user from /forgot-password to /dashboard", async () => {
    const req = makeRequest("/forgot-password");
    const result = await handleAuthRouting(req, "valid-token");
    expect(result?.headers.get("location")).toContain("/dashboard");
  });
});
