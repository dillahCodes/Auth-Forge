import { AppError } from "@/errors/app-error";
import { AuthInvalidCredentials } from "@/errors/auth-error";
import { ResourceConflict } from "@/errors/resource-error";
import { validateRegisterForm } from "@/features/auth/helper/register-helper";
import {
  errorResponse,
  internalServerError,
  sendSuccess,
} from "@/helper/response-helper";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    // Parse & validate request
    const parsed = await validateRegisterForm(req);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      throw new AuthInvalidCredentials(errors);
    }

    const { name, email, password } = parsed.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      throw new ResourceConflict("Email already exists", {
        email: ["Email already exists"],
      });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Return success
    const userData = { userId: user.id, name: user.name, email: user.email };
    return sendSuccess(userData, "Register successfully");
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
