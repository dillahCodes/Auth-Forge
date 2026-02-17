import { EmailChangeRequestRepository } from "../repositories/email-change-request.repository";
import { UserRepository } from "../repositories/user.repositoriy";

export const MeService = {
  async getMe(userId: string) {
    const user = await UserRepository.getById(userId);
    const pendingEmailChange = await EmailChangeRequestRepository.findPendingByUserId(userId);

    return { user, pendingEmailChange };
  },
};
