/*
  Warnings:

  - The `provider` column on the `Account` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('GOOGLE', 'CREDENTIALS');

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "provider",
ADD COLUMN     "provider" "AuthProvider" NOT NULL DEFAULT 'CREDENTIALS';

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
