import { geolocation } from "@vercel/functions";

const getClientLocation = (req: Request) => {
  const { city, country, countryRegion, region } = geolocation(req);

  const location = {
    city: city ? city : "Unknown",
    country: country ? country : "Unknown",
    countryRegion: countryRegion ? countryRegion : "Unknown",
    region: region ? region : "Unknown",
  };

  return location;
};

export { getClientLocation };
