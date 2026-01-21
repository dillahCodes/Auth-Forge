import { Reader } from "@maxmind/geoip2-node";
import fs from "fs";
import path from "path";

const base = path.join(process.cwd(), "src", "lib", "geolocation", "maxmind-db");

const readers = {
  country: Reader.openBuffer(fs.readFileSync(path.join(base, "GeoLite2-Country.mmdb"))),
  city: Reader.openBuffer(fs.readFileSync(path.join(base, "GeoLite2-City.mmdb"))),
  asn: Reader.openBuffer(fs.readFileSync(path.join(base, "GeoLite2-ASN.mmdb"))),
};

export const geoMaxmind = (ip: string) => {
  const countryRes = readers.country.country(ip);
  const cityRes = readers.city.city(ip);
  const asnRes = readers.asn.asn(ip);

  return {
    continent: countryRes?.continent?.code ?? null,
    country: countryRes?.country?.names?.en ?? null,
    countryRegion: cityRes?.subdivisions?.[0]?.isoCode ?? null,
    city: cityRes?.city?.names?.en ?? null,
    latitude: cityRes?.location?.latitude ?? null,
    longitude: cityRes?.location?.longitude ?? null,
    asn: asnRes?.autonomousSystemNumber ?? null,
    isp: asnRes?.autonomousSystemOrganization ?? null,
  };
};
