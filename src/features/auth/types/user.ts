import { AuthProvider, EmailChangeRequest } from "../../../../prisma/generated/client";

export interface User {
  id: string;
  email: string;
  pendingEmailChange: EmailChangeRequest | null;
  name: string;
  password: string;
  verifiedAt: Date | null;
  providers: UserAccount[];
}

export type UserData = Omit<User, "password">;

export interface UserAccount {
  isCurrentProvider: boolean;
  provider: AuthProvider;
  providerAccountId: string;
  id: string;
}
