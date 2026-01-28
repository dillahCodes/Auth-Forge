import { LoginController } from "@/features/auth/controllers/login.controller";

export async function POST(req: Request) {
  return await LoginController.login(req);
}
