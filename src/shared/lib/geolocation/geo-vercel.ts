import { geoMaxmind } from "./geo-maxmind";

export interface Geolocation {
  ipAddress: string;
  continent: string | null;
  country: string | null;
  countryRegion: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  asn: number | null;
  isp: string | null;
}

export const geoVercel = (req: Request, ip: string): Geolocation => {
  const maxmind = geoMaxmind(ip);
  const headers = req.headers;

  const getHeaderString = (name: string): string | null => {
    return headers.get(name) ?? null;
  };

  const getHeaderNumber = (name: string): number | null => {
    const value = headers.get(name);
    return value ? parseFloat(value) : null;
  };

  return {
    ipAddress: ip,
    continent: getHeaderString("x-vercel-ip-continent") ?? maxmind.continent,
    country: getHeaderString("x-vercel-ip-country") ?? maxmind.country,
    countryRegion: getHeaderString("x-vercel-ip-country-region") ?? maxmind.countryRegion,
    city: getHeaderString("x-vercel-ip-city") ?? maxmind.city,
    latitude: getHeaderNumber("x-vercel-ip-latitude") ?? maxmind.latitude,
    longitude: getHeaderNumber("x-vercel-ip-longitude") ?? maxmind.longitude,
    asn: maxmind.asn,
    isp: maxmind.isp,
  };
};
