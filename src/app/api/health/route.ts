import { AppError } from "@/errors/app-error";
import {
  errorResponse,
  internalServerError,
  sendSuccess,
} from "@/helper/response-helper";
import { getClientInfo } from "@/lib/client-info";
import { geoVercel } from "@/lib/geolocation/geo-vercel";

export async function GET(req: Request) {
  try {
    const clientInfo = getClientInfo(req);
    const geolocation = geoVercel(req, clientInfo.ip as string);

    // const whoisAPi = await whoisGeoLocation(clientInfo.ip as string);
    // console.log("whoisAPi", whoisAPi);

    // const data = {
    //   ip: clientInfo.ip,
    //   ...geolocation,
    // };
    // console.log("Geolocation:", data);

    // const resultRateLimiter = await rateLimiterFixedWindow({
    //   key: `ip:${clientInfo.ip}:ua:${clientInfo.userAgent}`,
    //   limit: 5,
    //   windowSeconds: 3,
    // });

    // if (!resultRateLimiter.isAllowed) throw new ToManyRequests();

    // const resultRateLimiter = await rateLimiterTokenBucket({
    //   key: `ip:${clientInfo.ip}:ua:${clientInfo.userAgent}`,
    //   bucketCapacity: 10,
    //   refillRatePerSecond: 1,
    // });

    // if (!resultRateLimiter.isAllowed) throw new ToManyRequests();

    // return sendSuccess(whoisAPi, "OK");
    return sendSuccess(geolocation, "OK");
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
