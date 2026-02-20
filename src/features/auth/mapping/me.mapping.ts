import { EmailChangeRequest } from "../../../../prisma/generated/client";
import { AuthProvider } from "../../../../prisma/generated/enums";
import { UserData } from "../types/user";

export interface MeMapping {
  user: Omit<UserData, "password" | "provider" | "pendingEmailChange"> | null;
  pendingEmailChange: EmailChangeRequest | null;
  provider: AuthProvider;
}

export const meMapping = (params: MeMapping) => {
  return {
    id: params.user?.id,
    name: params.user?.name,
    email: params.user?.email,
    pendingEmailChange: params.pendingEmailChange,
    verifiedAt: params.user?.verifiedAt,
    provider: params.provider,
  } as UserData;
};
