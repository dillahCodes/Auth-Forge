import { TwoFaController } from "@/features/auth/controllers/2fa.controller";

export async function POST(req: Request) {
  return await TwoFaController.verifyOtp(req);
}
