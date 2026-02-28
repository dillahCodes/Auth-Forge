import { AccountController } from "@/features/auth/controllers/account.controller";

export async function DELETE(req: Request) {
  return await AccountController.changeEmailCancelRequest(req);
}
