import { geolocation } from "@vercel/functions";
import "server-only";

const toNumberOrNull = (value?: string | null): number | null => {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toStringOrNull = (value?: string | null): string | null => {
  return value ?? null;
};

const getClientLocation = (req: Request) => {
  const { region } = geolocation(req);
  const continent = req.headers.get("x-vercel-ip-continent");
  const country = req.headers.get("x-vercel-ip-country");
  const countryRegion = req.headers.get("x-vercel-ip-country-region");
  const city = req.headers.get("x-vercel-ip-city");
  const latitude = req.headers.get("x-vercel-ip-latitude");
  const longitude = req.headers.get("x-vercel-ip-longitude");

  return {
    continent: toStringOrNull(continent),
    country: toStringOrNull(country),
    countryRegion: toStringOrNull(countryRegion),
    city: toStringOrNull(city),
    latitude: toNumberOrNull(latitude),
    longitude: toNumberOrNull(longitude),
    region: toStringOrNull(region),
  };
};

export { getClientLocation };
