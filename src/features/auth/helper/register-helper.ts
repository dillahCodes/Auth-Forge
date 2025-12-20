import { registerSchema } from "../schemas/registerSchema";

// DOC: validate login form
export async function validateRegisterForm(req: Request) {
  const formData = await req.formData();
  return registerSchema.safeParse(Object.fromEntries(formData));
}
