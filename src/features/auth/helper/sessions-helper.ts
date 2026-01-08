import { parseDevice } from "@/lib/parse-device";
import { prisma } from "@/lib/prisma";
import "server-only";

interface Sessions {
  id: string;
  userId: string;
  refreshToken: string;
  ipAddress: string | null;
  city: string | null;
  country: string | null;
  countryRegion: string | null;
  userAgent: string | null;
  replacedBy: string | null;
  revoked: boolean;
  createdAt: Date;
  expiresAt: Date;
}

export const sessionsMapping = (data: Sessions[], currentSessionId: string) => {
  const response = {
    currentSessionId,
    sessions: data.map((session) => ({
      id: session.id,
      device: parseDevice(session.userAgent),
      location: {
        country: session.country,
        countryRegion: session.countryRegion,
        city: session.city,
      },
      isCurrent: session.id === currentSessionId,
      loggedInAt: session.createdAt,
      status: "Active",
    })),
  };

  return response;
};

export const getSessionbySessionid = async (sessionId: string) => {
  const session = await prisma.sessions.findUnique({
    where: { id: sessionId },
    select: { id: true, userId: true, revoked: true, replacedBy: true },
  });
  return session;
};

export const deleteAllSessionByUserId = async (userId: string) => {
  await prisma.sessions.updateMany({
    where: { userId },
    data: { revoked: true, deletedAt: new Date() },
  });
};
