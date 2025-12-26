"use client";

import { Activity } from "react";
import { Session } from "../types/sessions";
import { useRevokeSession } from "../hooks/use-revoke-session";
import { useState } from "react";

interface OtherSessionsProps {
  otherSessions: Session[] | undefined;
  isLoading: boolean;
}

export default function OtherSessions({ isLoading, otherSessions }: OtherSessionsProps) {
  const { mutate: revokeSession } = useRevokeSession();
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null);

  const handleRevoke = (sessionId: string) => {
    setRevokingSessionId(sessionId);

    revokeSession(sessionId, {
      onSettled: () => setRevokingSessionId(null),
    });
  };

  return (
    <section className="border p-3 rounded-md">
      <h2 className="font-bold mb-2">Logins on Other Devices</h2>

      <Activity name="Other Sessions loading" mode={isLoading ? "visible" : "hidden"}>
        <p>Loading sessions...</p>
      </Activity>

      <Activity
        name="Other Sessions Empty"
        mode={!isLoading && !otherSessions?.length ? "visible" : "hidden"}
      >
        <p className="text-sm text-gray-500">No other active sessions</p>
      </Activity>

      <ul className="flex flex-col gap-3">
        {otherSessions?.map((session) => {
          const isThisRevoking = revokingSessionId === session.id;

          return (
            <li
              key={session.id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <div className="text-sm">
                <p className="font-semibold">{session.device}</p>
                <p>
                  <span>{session.location.city || "Unknown City"}</span>,{" "}
                  <span>{session.location.country || "Unknown Country"}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Login at {new Date(session.loggedInAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => handleRevoke(session.id)}
                disabled={isThisRevoking}
                className="text-sm px-3 py-1 cursor-pointer rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
              >
                {isThisRevoking ? "Logging out..." : "Logout"}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
