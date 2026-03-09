import { CronController } from "@/features/cron/controllers/cron.controller";

export async function GET(req: Request) {
  return await CronController.cleanupSessions(req);
}
