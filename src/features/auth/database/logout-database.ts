import { prisma } from "@/lib/prisma";

export const revokeSessionBySessionId = async (sessionId: string) => {
  return await prisma.sessions.update({
    where: { id: sessionId },
    data: { revoked: true },
  });
};
