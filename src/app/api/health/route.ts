import { AppError } from "@/errors/app-error";
import {
  errorResponse,
  internalServerError,
  sendSuccess,
} from "@/helper/response-helper";
import crypto from "crypto";
import { sha256 } from "js-sha256";

export const POW = {
  solve: (nonce: string, difficulty: number) => {
    const target = "0".repeat(difficulty);
    let counter = 0;

    while (true) {
      const hash = sha256(nonce + counter);
      if (hash.startsWith(target)) return counter.toString();
      counter++;
    }
  },

  verify: (nonce: string, proof: string, difficulty: number) => {
    const target = "0".repeat(difficulty);
    const result = sha256(nonce + proof);
    const isValid = result.startsWith(target);
    return isValid;
  },
};

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
