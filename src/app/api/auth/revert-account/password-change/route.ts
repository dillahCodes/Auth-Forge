import { RevertAccountController } from "@/features/auth/controllers/revert-account.controller";

export async function POST(req: Request) {
  return await RevertAccountController.verifyTokenRevertAccountPasswordChange(req);
}
