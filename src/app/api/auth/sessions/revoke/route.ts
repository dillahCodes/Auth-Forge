import { SessionsController } from "@/features/auth/controllers/sessions.controller";

export async function DELETE(req: Request) {
  return await SessionsController.revokeAll(req);
}
