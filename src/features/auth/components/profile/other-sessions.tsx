"use client";

import { Button } from "@/shared/components/ui/button";
import iso3166 from "iso-3166-2";
import { Activity, useState } from "react";
import { useRevokeSession } from "../../hooks/use-revoke-session";
import { useRevokeSessions } from "../../hooks/use-revoke-sessions";
import { Session } from "../../types/sessions";

interface OtherSessionsProps {
  otherSessions: Session[] | undefined;
  isLoading: boolean;
}

export default function OtherSessions({ isLoading, otherSessions }: OtherSessionsProps) {
  const { mutate: revokeSession } = useRevokeSession();
  const { mutate: revokeAll, isPending: isRevokeAllPending } = useRevokeSessions();

  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null);

  const handleRevoke = (sessionId: string) => () => {
    setRevokingSessionId(sessionId);

    revokeSession(sessionId, {
      onSettled: () => setRevokingSessionId(null),
    });
  };

  const handleRevokeAll = () => revokeAll(undefined);

  if (isLoading) return <OtherSessionsLoading />;

  return (
    <section className="border-2 shadow-strong p-3">
      <h2 className="font-bold mb-2">Logins on Other Devices</h2>

      <Activity name="Other Sessions Empty" mode={!isLoading && !otherSessions?.length ? "visible" : "hidden"}>
        <p className="text-sm text-gray-500">No other active sessions</p>
      </Activity>

      {/* list session */}
      <ul className="flex flex-col gap-3">
        {otherSessions?.map((session) => {
          const isThisRevoking = revokingSessionId === session.id;
          const { location } = session || {};
          const { city, country, countryRegion } = location || {};

          const decodeCty = decodeURIComponent(city || "");
          const isoCountry = iso3166.country(country || "")?.name;
          const isoCountryRegion = iso3166.subdivision(country || "", countryRegion || "")?.name;

          return (
            <li key={session.id} className="flex justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <span className="min-w-6 min-h-6 bg-info rounded-full border-2 border-dark" />
                <div className="text-sm">
                  <p className="font-semibold line-clamp-1">{session.device}</p>
                  <p className="line-clamp-1">
                    <Activity name="Current Session" mode={decodeCty ? "visible" : "hidden"}>
                      <span>{decodeCty || "Unknown City"}</span>,{" "}
                    </Activity>
                    <Activity name="Current Session" mode={isoCountryRegion ? "visible" : "hidden"}>
                      <span>{isoCountryRegion || "Unknown Country Region"}</span>,{" "}
                    </Activity>
                    <span>{isoCountry || "Unknown Country"}</span>
                  </p>
                  <p className="text-xs text-gray-500">{new Date(session.loggedInAt).toLocaleString()}</p>
                </div>
              </div>

              <Button
                variant="danger"
                className="font-bold"
                onClick={handleRevoke(session.id)}
                disabled={isThisRevoking}
              >
                {isThisRevoking ? "Logging out..." : "Logout"}
              </Button>
            </li>
          );
        })}
      </ul>

      {/* logout all */}
      <Activity name="Logout All Devices" mode={otherSessions && otherSessions.length ? "visible" : "hidden"}>
        <Button
          variant="danger"
          className="font-bold w-full mt-4"
          onClick={handleRevokeAll}
          disabled={isRevokeAllPending}
        >
          {isRevokeAllPending ? "Logging out..." : "Logout All"}
        </Button>
      </Activity>
    </section>
  );
}

function OtherSessionsLoading() {
  return (
    <div className="border-2 border-dark shadow-strong p-3 space-y-2 w-full">
      <div className="h-6 bg-dark/20 border-2 border-dark"></div>
      <div className="h-6 bg-dark/20 border-2 border-dark"></div>
      <div className="h-6 bg-dark/20 border-2 border-dark"></div>
    </div>
  );
}
