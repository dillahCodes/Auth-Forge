import { SessionRepository } from "@/features/auth/repositories/session.repository";
import { prisma } from "@/shared/lib/prisma";

export const CronService = {
  keepAlive: async () => {
    await prisma.$queryRaw`SELECT id FROM "User" LIMIT 1`;
  },

  cleanupSessions: async () => {
    const result = await SessionRepository.softDeleteExpiredSessions();
    return result.count;
  },
};
