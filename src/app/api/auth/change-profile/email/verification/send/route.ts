import { AccountController } from "@/features/auth/controllers/account.controller";

export async function POST(req: Request) {
  return await AccountController.changeEmailSendVerify(req);
}
