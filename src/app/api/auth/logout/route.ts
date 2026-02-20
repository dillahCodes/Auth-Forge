import { AuthController } from "@/features/auth/controllers/auth.controller";

export async function POST(req: Request) {
  return await AuthController.logout(req);
}
