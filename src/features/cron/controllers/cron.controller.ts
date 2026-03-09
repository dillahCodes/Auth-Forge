import { CreateController } from "@/features/auth/controllers/create.controller";
import { sendSuccess } from "@/shared/utils/response-helper";
import { CronHttp } from "../http/cron.http";
import { CronService } from "../services/cron.service";

export const CronController = {
  keepAlive: CreateController.create(async (req: Request) => {
    CronHttp.requiredBearerToken(req);
    await CronService.keepAlive();
    return sendSuccess(null, "Keep alive successfully");
  }),

  cleanupSessions: CreateController.create(async (req: Request) => {
    CronHttp.requiredBearerToken(req);
    const rowsAffected = await CronService.cleanupSessions();
    return sendSuccess(null, `Cleanup ${rowsAffected} sessions successfully`);
  }),
};
