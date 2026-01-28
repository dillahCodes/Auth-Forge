import { SessionsController } from "@/features/auth/controllers/sessions.controller";

export async function GET(req: Request) {
  return await SessionsController.getAllSessions(req);
}
