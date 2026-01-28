import { SessionsController } from "@/features/auth/controllers/sessions.controller";

type Params = RouteContext<"/api/auth/sessions/[sessionId]">;

export async function POST(req: Request, { params }: Params) {
  return await SessionsController.revokeById(req, { params });
}
