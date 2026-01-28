import { MeController } from "@/features/auth/controllers/me.controller";

export async function GET(req: Request) {
  return await MeController.getMe(req);
}
