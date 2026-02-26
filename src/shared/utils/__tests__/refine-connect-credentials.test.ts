import { describe, it, expect } from "vitest";
import { refineConnectCredentials } from "@/shared/utils/refine-connect-credentials";
import z from "zod";

// Helper to collect errors from refineConnectCredentials
function runRefine(data: { mode: "BIND" | "UNBIND"; password?: string; confirmPassword?: string }) {
  const issues: z.ZodIssue[] = [];
  const ctx = {
    addIssue: (issue: Parameters<z.RefinementCtx["addIssue"]>[0]) =>
      issues.push({ ...(issue as unknown as Record<string, unknown>), fatal: false } as unknown as z.ZodIssue),
  } as unknown as z.RefinementCtx;
  refineConnectCredentials(data, ctx);
  return issues;
}

describe("refineConnectCredentials", () => {
  it("should not add issues when mode is UNBIND", () => {
    const issues = runRefine({ mode: "UNBIND" });
    expect(issues).toHaveLength(0);
  });

  it("should add issue when mode is BIND and password is missing", () => {
    const issues = runRefine({ mode: "BIND", confirmPassword: "password123" });
    const paths = issues.map((i) => i.path[0]);
    expect(paths).toContain("password");
  });

  it("should add issue when mode is BIND and confirmPassword is missing", () => {
    const issues = runRefine({ mode: "BIND", password: "password123" });
    const paths = issues.map((i) => i.path[0]);
    expect(paths).toContain("confirmPassword");
  });

  it("should not add issues when BIND mode and passwords match", () => {
    const issues = runRefine({ mode: "BIND", password: "password123", confirmPassword: "password123" });
    expect(issues).toHaveLength(0);
  });

  it("should add issue when BIND mode and passwords do not match", () => {
    const issues = runRefine({ mode: "BIND", password: "password123", confirmPassword: "different456" });
    const paths = issues.map((i) => i.path[0]);
    expect(paths).toContain("confirmPassword");
  });
});
