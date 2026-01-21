import { prisma } from "@/lib/prisma";
import { registerSchema } from "../schemas/register-schema";
import { AuthInvalidCredentials } from "@/errors/auth-error";
import { ResourceConflict } from "@/errors/resource-error";

// DOC: validate login form
export async function validateRegisterForm(req: Request) {
  const formData = await req.formData();
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    throw new AuthInvalidCredentials(errors);
  }

  return parsed;
}

// DOC: check if email exists
export async function isEmailExists(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    throw new ResourceConflict("Email already exists", {
      email: ["Email already exists"],
    });
  }

  return user;
}
