import { ForgotPasswordController } from "@/features/auth/controllers/forgot-password.controller";

export async function POST(req: Request) {
  return await ForgotPasswordController.verifyOtpForgotPassword(req);
}
