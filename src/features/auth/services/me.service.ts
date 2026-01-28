import { UserRepository } from "../repositories/user.repositoriy";

export const MeService = {
  async getMe(userId: string) {
    const user = await UserRepository.getById(userId);
    return user;
  },
};
