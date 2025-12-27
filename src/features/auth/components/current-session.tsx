import { Activity } from "react";
import { Session } from "../types/sessions";

export default function CurrentSession({
  currentSession,
}: {
  currentSession: Session | undefined;
}) {
  return (
    <Activity name="Current Session" mode={currentSession ? "visible" : "hidden"}>
      <section className="border p-3 rounded-md">
        <h2 className="font-bold mb-2">Current Device</h2>
        <div className="text-sm border border-white p-2 rounded-sm">
          <p className="font-semibold">{currentSession?.device}</p>
          <p>
            <span>
              {decodeURIComponent(currentSession?.location?.city || "") || "Unknown City"}
            </span>
            ,{" "}
            <span>
              {decodeURIComponent(currentSession?.location?.country || "") ||
                "Unknown Country"}
            </span>
          </p>
          <p className="text-xs text-gray-500">
            Login at {new Date(currentSession?.loggedInAt || 0).toLocaleString()}
          </p>
        </div>
      </section>
    </Activity>
  );
}
