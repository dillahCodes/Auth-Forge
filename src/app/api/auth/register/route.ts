import { validateRegisterForm } from "@/features/auth/helper/register-helper";
import { badRequest, sendSuccess, serverError } from "@/helper/response-helper";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // Parse & validate request
    const parsed = await validateRegisterForm(req);
    if (!parsed.success) {
      return badRequest("Please check your input", parsed.error.flatten().fieldErrors);
    }

    const { name, email, password } = parsed.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return badRequest("User already exists");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Return success
    return sendSuccess(
      { userId: user.id, name: user.name, email: user.email },
      "Register successfully"
    );
  } catch (error) {
    console.error("Register Error:", error);
    return serverError(error);
  }
}
