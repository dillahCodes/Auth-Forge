import { getClientInfo } from "@/shared/lib/client-info";
import { geoVercel } from "@/shared/lib/geolocation/geo-vercel";

export const ClientInfoHttp = {
  // DOC: Extract client info from request
  info(req: Request) {
    const result = getClientInfo(req);
    return result;
  },

  // DOC: Extract geolocation based on IP
  geoLocation(req: Request, ip: string | null) {
    const result = geoVercel(req, ip as string);
    return result;
  },
};
