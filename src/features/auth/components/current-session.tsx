import { Activity } from "react";
import { Session } from "../types/sessions";
import iso3166 from "iso-3166-2";
import { useLogout } from "../hooks/use-logout";
import { Button } from "@/shared/components/ui/button";

export default function CurrentSession({
  currentSession,
  isLoading,
}: {
  currentSession: Session | undefined;
  isLoading: boolean;
}) {
  const { mutate: logout, isPending } = useLogout();

  const { location } = currentSession || {};
  const { city, country, countryRegion } = location || {};

  const decodeCty = decodeURIComponent(city || "");
  const isoCountry = iso3166.country(country || "")?.name;
  const isoCountryRegion = iso3166.subdivision(country || "", countryRegion || "")?.name;

  if (isLoading) return <CurrentSessionLoading />;

  return (
    <Activity name="Current Session" mode={currentSession ? "visible" : "hidden"}>
      <section className="border-2 p-3 shadow-strong">
        <h2 className="font-bold mb-2">Current Device</h2>
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center">
            <span className="w-6 h-6 bg-info rounded-full border-2 border-dark" />
            <div className="text-sm border border-white p-2">
              <p className="font-semibold">{currentSession?.device}</p>
              <p>
                <Activity name="Current Session" mode={decodeCty ? "visible" : "hidden"}>
                  <span>{decodeCty || "Unknown City"}</span>,{" "}
                </Activity>
                <Activity name="Current Session" mode={isoCountryRegion ? "visible" : "hidden"}>
                  <span>{isoCountryRegion || "Unknown Country Region"}</span>,{" "}
                </Activity>
                <span>{isoCountry || "Unknown Country"}</span>
              </p>
            </div>
          </div>
          <Button variant="danger" onClick={() => logout()} disabled={isPending} className="font-bold">
            {isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </section>
    </Activity>
  );
}

export function CurrentSessionLoading() {
  return (
    <div className="border-2 border-dark shadow-strong p-3 space-y-2 w-full">
      <div className="h-6 bg-dark/20 border-2 border-dark"></div>
      <div className="h-6 bg-dark/20 border-2 border-dark"></div>
      <div className="h-6 bg-dark/20 border-2 border-dark"></div>
    </div>
  );
}
