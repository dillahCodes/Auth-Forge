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

let cachedIpMeta: IpWhoResponse | null = null;

export async function getDevMetadata(): Promise<IpWhoResponse | null> {
  if (cachedIpMeta) return cachedIpMeta;

  try {
    const res = await fetch("https://ipwho.is/");
    const data = await res.json();

    if (!data?.success) return null;

    cachedIpMeta = data;
    return data;
  } catch {
    return null;
  }
}
