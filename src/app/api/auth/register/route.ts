import { RegisterController } from "@/features/auth/controllers/register.controller";

export async function POST(req: Request) {
  return await RegisterController.register(req);
}
