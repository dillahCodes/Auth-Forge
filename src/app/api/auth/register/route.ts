import { AppError } from "@/errors/app-error";
import { createUserEmailPassword } from "@/features/auth/database/register-database";
import {
  isEmailExists,
  validateRegisterForm,
} from "@/features/auth/validation/register-validation";
import {
  errorResponse,
  internalServerError,
  sendSuccess,
} from "@/helper/response-helper";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    // DOC: Parse & validate request
    const parsed = await validateRegisterForm(req);
    const { name, email, password } = parsed.data;

    // DOC: Check if user already exists
    await isEmailExists(email);

    // DOC: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // DOC: Create user
    const user = await createUserEmailPassword(name, email, hashedPassword);

    // Return success
    const userData = { userId: user.id, name: user.name, email: user.email };
    return sendSuccess(userData, "Register successfully");
  } catch (error) {
    if (error instanceof AppError) return errorResponse(error);
    return internalServerError(error);
  }
}
