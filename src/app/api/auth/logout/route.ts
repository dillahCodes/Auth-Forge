import { LogoutController } from "@/features/auth/controllers/logout.controller";

export async function POST(req: Request) {
  return await LogoutController.logout(req);
}
