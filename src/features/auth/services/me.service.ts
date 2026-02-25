import { AuthProvider } from "../../../../prisma/generated/enums";
import { EmailChangeRequestRepository } from "../repositories/email-change-request.repository";
import { UserRepository } from "../repositories/user.repositoriy";

export const MeService = {
  async getMe(userId: string, provider: AuthProvider) {
    const user = await UserRepository.getById({ userId });
    const pendingEmailChange = await EmailChangeRequestRepository.findPendingByUserId(userId);
    const accounts = await UserRepository.getAccountsByUserId(userId);

    return { user, pendingEmailChange, provider, accounts };
  },
};
