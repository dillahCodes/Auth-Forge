import { SessionsController } from "@/features/auth/controllers/sessions.controller";

type Params = RouteContext<"/api/auth/sessions/[sessionId]">;

export async function DELETE(req: Request, { params }: Params) {
  return await SessionsController.revokeById(req, { params });
}
