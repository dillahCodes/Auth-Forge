import { EmailChangeRequest } from "../../../../prisma/generated/client";
import { UserData } from "../types/user";

export interface MeMapping {
  user: UserData | null;
  pendingEmailChange: EmailChangeRequest | null;
}

export const meMapping = ({ user, pendingEmailChange }: MeMapping) => {
  return {
    id: user?.id,
    name: user?.name,
    email: user?.email,
    pendingEmailChange,
    verifiedAt: user?.verifiedAt,
  } as UserData;
};
