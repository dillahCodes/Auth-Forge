import axios, { AxiosError } from "axios";

export interface IpWhoResponse {
  ip: string;
  success: boolean;
  type: "IPv4" | "IPv6";

  continent: string;
  continent_code: string;

  country: string;
  country_code: string;
  is_eu: boolean;

  region: string;
  region_code: string;
  city: string;
  postal: string;

  latitude: number;
  longitude: number;

  calling_code: string;
  capital: string;
  borders: string;

  flag: {
    img: string;
    emoji: string;
    emoji_unicode: string;
  };

  connection: {
    asn: number;
    org: string;
    isp: string;
    domain: string;
  };

  timezone: {
    id: string;
    abbr: string;
    is_dst: boolean;
    offset: number;
    utc: string;
    current_time: string;
  };
}

export function formatGeoLocation(geoLocation: IpWhoResponse | null) {
  if (!geoLocation) return null;

  return {
    continent: geoLocation.continent,
    country: geoLocation.country_code,
    countryRegion: geoLocation.region_code,
    city: geoLocation.city,
    latitude: geoLocation.latitude,
    longitude: geoLocation.longitude,
    asn: geoLocation.connection.asn,
    isp: geoLocation.connection.isp,
  };
}

export async function whoisGeoLocation(
  ipAddress: string | null
): Promise<IpWhoResponse | null> {
  if (!ipAddress) return null;

  try {
    const { data, status } = await axios.get("https://ipwho.is/" + ipAddress, {
      timeout: 10000,
    });

    if (status !== 200) return null;
    if (!data.success) return null;

    return data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Failed to get geo location:", error.response?.data);
    }
    console.error("Failed to get geo location:", error);
    return null;
  }
}
