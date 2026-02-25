import { UserAccount } from "@/features/auth/types/user";
import { AuthProvider } from "../../../prisma/generated/browser";

interface isMatchedAccountParams {
  provider: AuthProvider;
  providerAccountId: string;
  targetProvider: AuthProvider;
  targetProviderAccountId: string;
}

type FindGoogleProvider = Omit<UserAccount, "isCurrentProvider">;

type Providers = Omit<UserAccount, "isCurrentProvider">;

export const ProviderHelpers = {
  isOnlyCredentialsProvider(providers?: Providers[]) {
    return providers?.length === 1 && providers[0].provider === AuthProvider.CREDENTIALS;
  },

  isOnlyGoogleProvider(providers?: Providers[]) {
    return providers?.length === 1 && providers[0].provider === AuthProvider.GOOGLE;
  },

  isContainsCredentials(providers?: Providers[]) {
    return providers?.some((p) => p.provider.includes(AuthProvider.CREDENTIALS)) ?? false;
  },

  isContainGoogle(providers?: Providers[]) {
    return providers?.some((p) => p.provider.includes(AuthProvider.GOOGLE)) ?? false;
  },

  isSingleProvider(providers?: Providers[]) {
    return providers?.length === 1;
  },

  getCurrentProvider(providers?: UserAccount[]) {
    return providers?.find((p) => p.isCurrentProvider) ?? null;
  },

  isCurrentProviderSame(currentProviderName: AuthProvider, provider: AuthProvider) {
    return currentProviderName === provider;
  },

  isMatchedProvider(params: isMatchedAccountParams) {
    return params.provider === params.targetProvider && params.providerAccountId === params.targetProviderAccountId;
  },

  findGoogleProvider(accounts: FindGoogleProvider[]) {
    return accounts.find((account) => account.provider === AuthProvider.GOOGLE);
  },

  findCredentialsProvider(accounts: FindGoogleProvider[]) {
    return accounts.find((account) => account.provider === AuthProvider.CREDENTIALS);
  },

  isProviderConnected(providerName: AuthProvider, providers?: UserAccount[]) {
    return providers?.some((p) => p.provider === providerName) ?? false;
  },
};
