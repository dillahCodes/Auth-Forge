import { sendSuccess } from "@/shared/utils/response-helper";
import { AccessTokenHttp } from "../http/access-token.http";
import { MeMapping, meMapping } from "../mapping/me.mapping";
import { MeService } from "../services/me.service";
import { SessionService } from "../services/session.service";
import { CreateController } from "./create.controller";

export const MeController = {
  getMe: CreateController.create(async (req: Request) => {
    const { userId, sessionId } = await AccessTokenHttp.requiredAccessToken(req);
    await SessionService.validateSessionForAccessToken(sessionId);

    const user = await MeService.getMe(userId);
    const mappedUserData = meMapping(user as MeMapping);
    return sendSuccess(mappedUserData, "Get my user data successfully");
  }),
};
