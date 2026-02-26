import { describe, it, expect } from "vitest";
import { ProviderHelpers } from "@/shared/utils/providers-helper";
import { AuthProvider } from "../../../../prisma/generated/enums";

const credAccount = { provider: AuthProvider.CREDENTIALS, providerAccountId: "cred-123", id: "acc-1" };
const googleAccount = { provider: AuthProvider.GOOGLE, providerAccountId: "google-456", id: "acc-2" };

describe("ProviderHelpers.isOnlyCredentialsProvider", () => {
  it("returns true when only credentials provider exists", () => {
    expect(ProviderHelpers.isOnlyCredentialsProvider([credAccount])).toBe(true);
  });

  it("returns false when google is also present", () => {
    expect(ProviderHelpers.isOnlyCredentialsProvider([credAccount, googleAccount])).toBe(false);
  });

  it("returns false for empty array", () => {
    expect(ProviderHelpers.isOnlyCredentialsProvider([])).toBe(false);
  });
});

describe("ProviderHelpers.isOnlyGoogleProvider", () => {
  it("returns true when only google provider exists", () => {
    expect(ProviderHelpers.isOnlyGoogleProvider([googleAccount])).toBe(true);
  });

  it("returns false when credentials is also present", () => {
    expect(ProviderHelpers.isOnlyGoogleProvider([credAccount, googleAccount])).toBe(false);
  });
});

describe("ProviderHelpers.isContainsCredentials", () => {
  it("returns true if credentials provider is in list", () => {
    expect(ProviderHelpers.isContainsCredentials([credAccount, googleAccount])).toBe(true);
  });

  it("returns false if credentials provider is not in list", () => {
    expect(ProviderHelpers.isContainsCredentials([googleAccount])).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(ProviderHelpers.isContainsCredentials(undefined)).toBe(false);
  });
});

describe("ProviderHelpers.isContainGoogle", () => {
  it("returns true if google provider is in list", () => {
    expect(ProviderHelpers.isContainGoogle([credAccount, googleAccount])).toBe(true);
  });

  it("returns false if google provider is not in list", () => {
    expect(ProviderHelpers.isContainGoogle([credAccount])).toBe(false);
  });
});

describe("ProviderHelpers.isSingleProvider", () => {
  it("returns true if only one provider", () => {
    expect(ProviderHelpers.isSingleProvider([credAccount])).toBe(true);
  });

  it("returns false if two providers", () => {
    expect(ProviderHelpers.isSingleProvider([credAccount, googleAccount])).toBe(false);
  });
});

describe("ProviderHelpers.getCurrentProvider", () => {
  it("returns the account marked as current", () => {
    const accounts = [
      { ...credAccount, isCurrentProvider: false },
      { ...googleAccount, isCurrentProvider: true },
    ];
    expect(ProviderHelpers.getCurrentProvider(accounts)).toEqual(accounts[1]);
  });

  it("returns null if no provider is current", () => {
    const accounts = [
      { ...credAccount, isCurrentProvider: false },
      { ...googleAccount, isCurrentProvider: false },
    ];
    expect(ProviderHelpers.getCurrentProvider(accounts)).toBeNull();
  });
});

describe("ProviderHelpers.isCurrentProviderSame", () => {
  it("returns true if provider names match", () => {
    expect(
      ProviderHelpers.isCurrentProviderSame(AuthProvider.GOOGLE, AuthProvider.GOOGLE)
    ).toBe(true);
  });

  it("returns false if provider names differ", () => {
    expect(
      ProviderHelpers.isCurrentProviderSame(AuthProvider.CREDENTIALS, AuthProvider.GOOGLE)
    ).toBe(false);
  });
});

describe("ProviderHelpers.isMatchedProvider", () => {
  it("returns true when both provider and providerAccountId match", () => {
    expect(
      ProviderHelpers.isMatchedProvider({
        provider: AuthProvider.GOOGLE,
        providerAccountId: "google-456",
        targetProvider: AuthProvider.GOOGLE,
        targetProviderAccountId: "google-456",
      })
    ).toBe(true);
  });

  it("returns false when provider does not match", () => {
    expect(
      ProviderHelpers.isMatchedProvider({
        provider: AuthProvider.CREDENTIALS,
        providerAccountId: "google-456",
        targetProvider: AuthProvider.GOOGLE,
        targetProviderAccountId: "google-456",
      })
    ).toBe(false);
  });
});

describe("ProviderHelpers.findGoogleProvider", () => {
  it("finds the google account from a list", () => {
    expect(ProviderHelpers.findGoogleProvider([credAccount, googleAccount])).toEqual(googleAccount);
  });

  it("returns undefined if no google account", () => {
    expect(ProviderHelpers.findGoogleProvider([credAccount])).toBeUndefined();
  });
});

describe("ProviderHelpers.findCredentialsProvider", () => {
  it("finds the credentials account from a list", () => {
    expect(ProviderHelpers.findCredentialsProvider([credAccount, googleAccount])).toEqual(credAccount);
  });

  it("returns undefined if no credentials account", () => {
    expect(ProviderHelpers.findCredentialsProvider([googleAccount])).toBeUndefined();
  });
});

describe("ProviderHelpers.isProviderConnected", () => {
  it("returns true if the provider is connected", () => {
    const accounts = [
      { ...credAccount, isCurrentProvider: false },
      { ...googleAccount, isCurrentProvider: true },
    ];
    expect(ProviderHelpers.isProviderConnected(AuthProvider.GOOGLE, accounts)).toBe(true);
  });

  it("returns false if the provider is not connected", () => {
    const accounts = [{ ...credAccount, isCurrentProvider: false }];
    expect(ProviderHelpers.isProviderConnected(AuthProvider.GOOGLE, accounts)).toBe(false);
  });

  it("returns false for undefined providers", () => {
    expect(ProviderHelpers.isProviderConnected(AuthProvider.GOOGLE, undefined)).toBe(false);
  });
});
