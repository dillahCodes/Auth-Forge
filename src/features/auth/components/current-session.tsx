import { Activity } from "react";
import { Session } from "../types/sessions";
import { getCountryName, getCountryRegionName } from "@/lib/client-location";

export default function CurrentSession({
  currentSession,
}: {
  currentSession: Session | undefined;
}) {
  const { location } = currentSession || {};
  const { city, country, countryRegion } = location || {};

  const decodeCty = decodeURIComponent(city || "");
  const isoCountryRegion = getCountryRegionName(countryRegion || "", country || "");
  const isoCountry = getCountryName(country || "");

  return (
    <Activity name="Current Session" mode={currentSession ? "visible" : "hidden"}>
      <section className="border p-3 rounded-md">
        <h2 className="font-bold mb-2">Current Device</h2>
        <div className="text-sm border border-white p-2 rounded-sm">
          <p className="font-semibold">{currentSession?.device}</p>
          <p>
            <span>{decodeCty || "Unknown City"}</span>,{" "}
            <span>{isoCountryRegion || "Unknown Country Region"}</span>,{" "}
            <span>{isoCountry || "Unknown Country"}</span>
          </p>
        </div>
      </section>
    </Activity>
  );
}
