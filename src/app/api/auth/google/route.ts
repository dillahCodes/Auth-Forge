import { GoogleAuthController } from "@/features/auth/controllers/google-auth.controller";

export async function GET(req: Request) {
  return GoogleAuthController.signIn(req);
}
