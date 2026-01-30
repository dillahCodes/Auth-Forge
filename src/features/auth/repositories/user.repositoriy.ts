import { prisma } from "@/shared/lib/prisma";

export const UserRepository = {
  // DOC: Find user by email
  getByEmail(email: string, withPassword = false) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        verifiedAt: true,
        password: withPassword,
      },
    });
  },

  // DOC: Find user by id
  getById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, verifiedAt: true },
    });
  },

  // DOC: Update user password (hashed)
  updatePassword(email: string, hashedPassword: string) {
    return prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
      select: { id: true, name: true, email: true },
    });
  },

  // DOC: Update user name
  updateName(userId: string, name: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { name },
      select: { id: true, name: true, email: true },
    });
  },

  // DOC: Update email verification date
  updateVerifiedAt(userId: string, verifiedAt: Date) {
    return prisma.user.update({
      where: { id: userId },
      data: { verifiedAt },
      select: { id: true, name: true, email: true, verifiedAt: true },
    });
  },

  // DOC: Update user email
  updateEmail(userId: string, email: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { email },
      select: { id: true, name: true, email: true },
    });
  },

  // DOC: Create new user
  create(data: { name: string; email: string; password: string }) {
    return prisma.user.create({
      data,
      select: { id: true, name: true, email: true },
    });
  },
};
