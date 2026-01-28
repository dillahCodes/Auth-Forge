import { sendSuccess } from "@/shared/utils/response-helper";
import { AccessTokenHttp } from "../http/access-token.http";
import { MeService } from "../services/me.service";
import { CreateController } from "./create.controller";

export const MeController = {
  getMe: CreateController.create(async (req: Request) => {
    const { userId } = await AccessTokenHttp.requiredAccessToken(req);
    const user = await MeService.getMe(userId);

    return sendSuccess(user, "Get my user data successfully");
  }),
};
