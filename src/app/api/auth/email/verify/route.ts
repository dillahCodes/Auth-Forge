import { VerifyEmailController } from "@/features/auth/controllers/verify-email.controller";

export async function POST(req: Request) {
  return await VerifyEmailController.verifyEmailOtp(req);
}
