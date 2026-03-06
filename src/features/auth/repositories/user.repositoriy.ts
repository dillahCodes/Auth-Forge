import { prisma } from "@/shared/lib/prisma";
import { AuthProvider, Prisma } from "../../../../prisma/generated/client";

interface RespositoryOptions {
  transaction?: Prisma.TransactionClient;
}

export interface CreateUserPayload {
  userData: { name: string; email: string; password: string | null; id?: string; verifiedAt?: Date | null };
  userAccount: { provider: AuthProvider; providerAccountId: string };
  options?: RespositoryOptions;
}

interface CreateAccountParams {
  userId: string;
  accountData: CreateUserPayload["userAccount"];
  options?: RespositoryOptions;
}

interface UpdateEmailParams {
  userId: string;
  email: string;
  options?: RespositoryOptions;
}

interface UpdateVerifiedAtParams {
  userId: string;
  verifiedAt: Date;
  options?: RespositoryOptions;
}

interface UpdateNameParams {
  userId: string;
  name: string;
  options?: RespositoryOptions;
}

interface UpdatePasswordParams {
  userId: string;
  hashedPassword: string | null;
  options?: RespositoryOptions;
}

interface GetUserByIdParams {
  userId: string;
  options?: { withPassword?: boolean; withAccounts?: boolean };
}

interface GetUserByEmailParams {
  email: string;
  options?: { withPassword?: boolean; withAccounts?: boolean };
}

interface GetAccount {
  provider: AuthProvider;
  providerAccountId: string;
}

interface DeleteAccount {
  provider: AuthProvider;
  providerAccountId: string;
  options?: RespositoryOptions;
}

interface GetProviderByNameParams {
  provider: AuthProvider;
  userId: string;
}

export const UserRepository = {
  // DOC: Find user by email
  getByEmail({ email, options }: GetUserByEmailParams) {
    const { withPassword, withAccounts } = options ?? {};
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        verifiedAt: true,
        password: withPassword ?? false,
        ...(withAccounts && { accounts: true }),
      },
    });
  },

  // DOC: Find user by id
  getById({ userId, options }: GetUserByIdParams) {
    const { withPassword } = options ?? {};
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, verifiedAt: true, password: withPassword ?? false, accounts: true },
    });
  },

  // DOC: Find account by provider id
  getUserByProvider({ provider, providerAccountId }: GetAccount) {
    return prisma.account.findUnique({
      where: { provider_providerAccountId: { provider, providerAccountId } },
      select: { user: { omit: { password: true } }, userId: true },
    });
  },

  // DOC: Find account by provider name
  getUserByProviderName({ provider, userId }: GetProviderByNameParams) {
    return prisma.account.findFirst({
      where: { provider: provider, userId },
      select: { user: { omit: { password: true } }, userId: true },
    });
  },

  // DOC: Find accounts by user id
  getAccountsByUserId(userId: string) {
    return prisma.account.findMany({
      where: { userId },
      select: { provider: true, providerAccountId: true, id: true },
    });
  },

  // DOC: Update user password (hashed)
  updatePassword({ userId, hashedPassword, options }: UpdatePasswordParams) {
    const db = options?.transaction ?? prisma;
    return db.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
      select: { id: true, name: true, email: true },
    });
  },

  // DOC: Update user name
  updateName({ userId, name, options }: UpdateNameParams) {
    const db = options?.transaction ?? prisma;
    return db.user.update({
      where: { id: userId },
      data: { name },
      select: { id: true, name: true, email: true },
    });
  },

  // DOC: Update email verification date
  updateVerifiedAt({ userId, verifiedAt, options }: UpdateVerifiedAtParams) {
    const db = options?.transaction ?? prisma;
    return db.user.update({
      where: { id: userId },
      data: { verifiedAt },
      select: { id: true, name: true, email: true, verifiedAt: true },
    });
  },

  // DOC: Update user email
  updateEmail({ userId, email, options }: UpdateEmailParams) {
    const db = options?.transaction ?? prisma;
    return db.user.update({
      where: { id: userId },
      data: { email },
      select: { id: true, name: true, email: true },
    });
  },

  // DOC: Create new user
  create({ userData, userAccount, options }: CreateUserPayload) {
    const db = options?.transaction ?? prisma;
    return db.user.create({
      data: { ...userData, accounts: { create: userAccount } },
      select: { id: true, name: true, email: true, verifiedAt: true },
    });
  },

  // DOC: Create new account for user (for social login)
  createAccount({ userId, accountData, options }: CreateAccountParams) {
    const db = options?.transaction ?? prisma;
    return db.account.create({
      data: { userId, ...accountData },
    });
  },

  // DOC: Delete account
  deleteAccount({ provider, providerAccountId, options }: DeleteAccount) {
    const db = options?.transaction ?? prisma;
    return db.account.delete({ where: { provider_providerAccountId: { provider, providerAccountId } } });
  },
};
