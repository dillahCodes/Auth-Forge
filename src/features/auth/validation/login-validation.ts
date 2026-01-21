import { AuthInvalidCredentials } from "@/errors/auth-error";
import bcrypt from "bcrypt";
import { getUserByEmail } from "../database/login-database";
import { loginSchema } from "../schemas/login-schema";

// DOC: validate login form
export async function validateLoginForm(req: Request) {
  const formData = await req.formData();
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    throw new AuthInvalidCredentials(errors);
  }

  return result;
}

// DOC: validate user
export async function validateCredentials(email: string, password: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new AuthInvalidCredentials({
      email: ["Invalid email or password"],
      password: ["Invalid email or password"],
    });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new AuthInvalidCredentials({
      email: ["Invalid email or password"],
      password: ["Invalid email or password"],
    });
  }

  return user;
}
