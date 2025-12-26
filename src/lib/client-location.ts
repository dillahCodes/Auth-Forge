import { geolocation } from "@vercel/functions";

const toNumberOrNull = (value?: string): number | null => {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toStringOrNull = (value?: string): string | null => {
  if (!value) return null;
  return value;
};

const getClientLocation = (req: Request) => {
  const { city, country, countryRegion, region, latitude, longitude } = geolocation(req);

  const location = {
    city: toStringOrNull(city),
    country: toStringOrNull(country),
    countryRegion: toStringOrNull(countryRegion),
    region: toStringOrNull(region),
    latitude: toNumberOrNull(latitude),
    longitude: toNumberOrNull(longitude),
  };

  return location;
};

export { getClientLocation };
