import { SessionsController } from "@/features/auth/controllers/sessions.controller";

export async function POST(req: Request) {
  return await SessionsController.refreshToken(req);
}
