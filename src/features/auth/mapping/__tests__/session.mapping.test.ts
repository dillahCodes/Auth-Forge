import { describe, it, expect } from "vitest";
import { sessionsMapping } from "@/features/auth/mapping/session.mapping";

const baseSession = {
  id: "session-1",
  userId: "user-1",
  refreshToken: "token-abc",
  ipAddress: "192.168.1.1",
  city: "Jakarta",
  country: "Indonesia",
  countryRegion: "DKI",
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  replacedBy: null,
  revoked: false,
  createdAt: new Date("2024-01-01T00:00:00Z"),
  expiresAt: new Date("2024-02-01T00:00:00Z"),
};

describe("sessionsMapping", () => {
  it("should include currentSessionId in the response", () => {
    const result = sessionsMapping([baseSession], "session-1");
    expect(result.currentSessionId).toBe("session-1");
  });

  it("should mark the current session with isCurrent = true", () => {
    const result = sessionsMapping([baseSession], "session-1");
    expect(result.sessions[0].isCurrent).toBe(true);
  });

  it("should mark non-current sessions with isCurrent = false", () => {
    const secondSession = { ...baseSession, id: "session-2" };
    const result = sessionsMapping([baseSession, secondSession], "session-1");
    expect(result.sessions[1].isCurrent).toBe(false);
  });

  it("should map location fields correctly", () => {
    const result = sessionsMapping([baseSession], "session-1");
    const location = result.sessions[0].location;
    expect(location.city).toBe("Jakarta");
    expect(location.country).toBe("Indonesia");
    expect(location.countryRegion).toBe("DKI");
  });

  it("should set loggedInAt from createdAt", () => {
    const result = sessionsMapping([baseSession], "session-1");
    expect(result.sessions[0].loggedInAt).toEqual(new Date("2024-01-01T00:00:00Z"));
  });

  it("should set status to Active", () => {
    const result = sessionsMapping([baseSession], "session-1");
    expect(result.sessions[0].status).toBe("Active");
  });

  it("should return a device string from userAgent", () => {
    const result = sessionsMapping([baseSession], "session-1");
    expect(typeof result.sessions[0].device).toBe("string");
    expect(result.sessions[0].device.length).toBeGreaterThan(0);
  });

  it("should handle null userAgent gracefully", () => {
    const session = { ...baseSession, userAgent: null };
    const result = sessionsMapping([session], "session-1");
    expect(result.sessions[0].device).toBe("Unknown Device");
  });

  it("should return empty sessions array for empty input", () => {
    const result = sessionsMapping([], "session-1");
    expect(result.sessions).toHaveLength(0);
  });
});
