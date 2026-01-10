import { AppError } from "@/errors/app-error";
import {
  errorResponse,
  internalServerError,
  sendSuccess,
} from "@/helper/response-helper";

export async function GET(_req: Request) {
  try {
    // const clientInfo = getClientInfo(req);

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

    return sendSuccess(null, "OK");
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
