import { AuthProvider, EmailChangeRequest } from "../../../../prisma/generated/client";

export interface User {
  id: string;
  email: string;
  pendingEmailChange: EmailChangeRequest | null;
  name: string;
  password: string;
  verifiedAt: Date | null;
  provider: AuthProvider;
}

export type UserData = Omit<User, "password">;
