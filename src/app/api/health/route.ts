import { AppError } from "@/errors/app-error";
import {
  errorResponse,
  internalServerError,
  sendSuccess,
} from "@/helper/response-helper";

export async function GET(_req: Request) {
  try {
    // BE SEND CHALLENGE
    // const nonce = crypto.randomBytes(16).toString("hex");
    // const difficulty = 4;

    // FE SOLVE PROOF
    // const proof = POW.solve(nonce, difficulty);

    // BE VERIFY PROOF
    // const valid = POW.verify(nonce, proof, difficulty);

    // console.log({
    //   nonce,
    //   proof,
    //   difficulty: "0".repeat(difficulty),
    //   valid: sha256(nonce + proof),
    // });

    // const clientInfo = getClientInfo(req);
    // const ipLimit = await rateLimiterFixedWindow({
    //   key: `rl:health:ip:${clientInfo.ip}`,
    //   limit: 5,
    //   windowSeconds: 60,
    // });
    // if (!ipLimit.isAllowed) {
    //   throw new ToManyRequests(undefined);
    // }

    return sendSuccess(null, "OK");
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
