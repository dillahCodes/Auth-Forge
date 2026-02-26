import { describe, it, expect } from "vitest";
import { meMapping } from "@/features/auth/mapping/me.mapping";
import { AuthProvider } from "../../../../../prisma/generated/enums";

const baseUser = {
  id: "user-1",
  name: "John Doe",
  email: "john@example.com",
  verifiedAt: null,
  providers: [],
};

const accounts = [
  { id: "acc-1", provider: AuthProvider.CREDENTIALS, providerAccountId: "cred-001", isCurrentProvider: false },
  { id: "acc-2", provider: AuthProvider.GOOGLE, providerAccountId: "google-001", isCurrentProvider: false },
];

describe("meMapping", () => {
  it("should map user fields correctly", () => {
    const result = meMapping({
      user: baseUser,
      pendingEmailChange: null,
      provider: AuthProvider.CREDENTIALS,
      accounts: [],
    });
    expect(result.id).toBe("user-1");
    expect(result.name).toBe("John Doe");
    expect(result.email).toBe("john@example.com");
  });

  it("should set pendingEmailChange", () => {
    const pending = { id: "ecr-1" } as never;
    const result = meMapping({
      user: baseUser,
      pendingEmailChange: pending,
      provider: AuthProvider.CREDENTIALS,
      accounts: [],
    });
    expect(result.pendingEmailChange).toEqual(pending);
  });

  it("should mark isCurrentProvider correctly", () => {
    const result = meMapping({
      user: baseUser,
      pendingEmailChange: null,
      provider: AuthProvider.GOOGLE,
      accounts,
    });

    const credProvider = result.providers?.find((p) => p.provider === AuthProvider.CREDENTIALS);
    const googleProvider = result.providers?.find((p) => p.provider === AuthProvider.GOOGLE);

    expect(credProvider?.isCurrentProvider).toBe(false);
    expect(googleProvider?.isCurrentProvider).toBe(true);
  });

  it("should include all accounts in providers array", () => {
    const result = meMapping({
      user: baseUser,
      pendingEmailChange: null,
      provider: AuthProvider.CREDENTIALS,
      accounts,
    });
    expect(result.providers).toHaveLength(2);
  });

  it("should handle null user gracefully", () => {
    const result = meMapping({
      user: null,
      pendingEmailChange: null,
      provider: AuthProvider.CREDENTIALS,
      accounts: [],
    });
    expect(result.id).toBeUndefined();
    expect(result.email).toBeUndefined();
  });
});
