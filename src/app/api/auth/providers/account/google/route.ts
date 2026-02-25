import { AuthGoogleController } from "@/features/auth/controllers/auth-google.controller";

export async function GET(req: Request) {
  return AuthGoogleController.signIn(req);
}
