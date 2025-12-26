const toNumberOrNull = (value?: string | null): number | null => {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toStringOrNull = (value?: string | null): string | null => {
  if (!value) return null;
  return value;
};

const getClientLocation = (req: Request) => {
  const countryRegion = req.headers.get("x-vercel-ip-continent");
  const country = req.headers.get("x-vercel-ip-country");
  const region = req.headers.get("x-vercel-ip-country-region");
  const city = req.headers.get("x-vercel-ip-city");
  const latitude = req.headers.get("x-vercel-ip-latitude");
  const longitude = req.headers.get("x-vercel-ip-longitude");

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
