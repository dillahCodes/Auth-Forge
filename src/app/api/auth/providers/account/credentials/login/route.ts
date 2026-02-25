import { AuthCredentialsController } from "@/features/auth/controllers/auth-credentials.controller";

export async function POST(req: Request) {
  return await AuthCredentialsController.login(req);
}
