import "server-only";
import { parseDevice } from "@/lib/parse-device";

interface Sessions {
  id: string;
  userId: string;
  refreshToken: string;
  ipAddress: string | null;
  city: string | null;
  country: string | null;
  countryRegion: string | null;
  region: string | null;
  userAgent: string | null;
  replacedBy: string | null;
  revoked: boolean;
  createdAt: Date;
  expiresAt: Date;
}

const sessionsMapping = (data: Sessions[], currentSessionId: string) => {
  const response = {
    currentSessionId,
    sessions: data.map((session) => ({
      id: session.id,
      device: parseDevice(session.userAgent),
      location: {
        city: session.city,
        country: session.country,
        countryRegion: session.countryRegion,
        region: session.region,
      },
      isCurrent: session.id === currentSessionId,
      loggedInAt: session.createdAt,
      status: "Active",
    })),
  };

  return response;
};

export { sessionsMapping };
