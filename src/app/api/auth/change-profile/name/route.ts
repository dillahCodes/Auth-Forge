import { AccountController } from "@/features/auth/controllers/account.controller";

export async function PATCH(req: Request) {
  return await AccountController.changeName(req);
}
