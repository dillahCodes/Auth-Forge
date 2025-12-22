import requiredAuth from "@/features/auth/guard/require-auth";
import { sendSuccess, serverError } from "@/helper/response-helper";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { id: userId } = await requiredAuth(req);

    await prisma.sessions.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });

    return sendSuccess(null, "Revoke All Sessions successfully");
  } catch (error) {
    console.error("Revoke All Sessions Error:", error);
    return serverError(error);
  }
}
