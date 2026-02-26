import { describe, it, expect } from "vitest";
import { ClientRouters, ClientPrivateRoutes, AuthRoutes } from "@/routers/client-router";

describe("ClientRouters", () => {
  it("should have /login as LOGIN route", () => {
    expect(ClientRouters.LOGIN).toBe("/login");
  });

  it("should have /register as REGISTER route", () => {
    expect(ClientRouters.REGISTER).toBe("/register");
  });

  it("should have /dashboard as DASHBOARD route", () => {
    expect(ClientRouters.DASHBOARD).toBe("/dashboard");
  });

  it("should have /profile as PROFILE route", () => {
    expect(ClientRouters.PROFILE).toBe("/profile");
  });

  it("should have /forgot-password as FORGOT_PASSWORD route", () => {
    expect(ClientRouters.FORGOT_PASSWORD).toBe("/forgot-password");
  });
});

describe("ClientPrivateRoutes", () => {
  it("should include /dashboard", () => {
    expect(ClientPrivateRoutes).toContain(ClientRouters.DASHBOARD);
  });

  it("should include /profile", () => {
    expect(ClientPrivateRoutes).toContain(ClientRouters.PROFILE);
  });

  it("should include /verify-email", () => {
    expect(ClientPrivateRoutes).toContain(ClientRouters.VERIFY_EMAIL);
  });

  it("should NOT include /login", () => {
    expect(ClientPrivateRoutes).not.toContain(ClientRouters.LOGIN);
  });
});

describe("AuthRoutes", () => {
  it("should include /login", () => {
    expect(AuthRoutes).toContain(ClientRouters.LOGIN);
  });

  it("should include /register", () => {
    expect(AuthRoutes).toContain(ClientRouters.REGISTER);
  });

  it("should NOT include /dashboard", () => {
    expect(AuthRoutes).not.toContain(ClientRouters.DASHBOARD);
  });
});
