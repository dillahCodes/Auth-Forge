import { Activity } from "react";
import { Session } from "../types/sessions";
import iso3166 from "iso-3166-2";

export default function CurrentSession({
  currentSession,
}: {
  currentSession: Session | undefined;
}) {
  const { location } = currentSession || {};
  const { city, country, countryRegion } = location || {};

  const decodeCty = decodeURIComponent(city || "");
  const isoCountry = iso3166.country(country || "")?.name;
  const isoCountryRegion = iso3166.subdivision(country || "", countryRegion || "")?.name;

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
