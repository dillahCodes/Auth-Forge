import { EmailChangeRequest } from "../../../../prisma/generated/client";
import { AuthProvider } from "../../../../prisma/generated/enums";
import { UserAccount, UserData } from "../types/user";

export interface MeMapping {
  user: Omit<UserData, "password" | "provider" | "pendingEmailChange"> | null;
  pendingEmailChange: EmailChangeRequest | null;
  provider: AuthProvider;
  accounts: UserAccount[];
}

export const meMapping = (params: MeMapping) => {
  return {
    id: params.user?.id,
    name: params.user?.name,
    email: params.user?.email,
    pendingEmailChange: params.pendingEmailChange,
    verifiedAt: params.user?.verifiedAt,
    providers: params.accounts.map((account) => ({
      provider: account.provider,
      providerAccountId: account.providerAccountId,
      isCurrentProvider: account.provider === params.provider,
      id: account.id,
    })),
  } as UserData;
};
