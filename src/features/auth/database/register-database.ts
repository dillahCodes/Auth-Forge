import { prisma } from "@/lib/prisma";

export const createUserEmailPassword = async (
  name: string,
  email: string,
  hashedPassword: string
) => {
  return await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });
};
