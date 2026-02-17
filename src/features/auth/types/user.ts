import { EmailChangeRequest } from "../../../../prisma/generated/client";

export interface User {
  id: string;
  email: string;
  pendingEmailChange: EmailChangeRequest | null;
  name: string;
  password: string;
  verifiedAt: Date | null;
}

export type UserData = Omit<User, "password">;
