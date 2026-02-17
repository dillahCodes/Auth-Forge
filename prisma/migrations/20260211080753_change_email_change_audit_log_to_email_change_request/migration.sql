/*
  Warnings:

  - You are about to drop the `EmailChangeAuditLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ReqStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELED');

-- DropForeignKey
ALTER TABLE "EmailChangeAuditLog" DROP CONSTRAINT "EmailChangeAuditLog_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "EmailChangeAuditLog" DROP CONSTRAINT "EmailChangeAuditLog_userId_fkey";

-- DropTable
DROP TABLE "EmailChangeAuditLog";

-- CreateTable
CREATE TABLE "EmailChangeRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "oldEmail" TEXT NOT NULL,
    "newEmail" TEXT NOT NULL,
    "reqStatus" "ReqStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailChangeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailChangeRequest_userId_key" ON "EmailChangeRequest"("userId");

-- CreateIndex
CREATE INDEX "EmailChangeRequest_createdAt_idx" ON "EmailChangeRequest"("createdAt");

-- AddForeignKey
ALTER TABLE "EmailChangeRequest" ADD CONSTRAINT "EmailChangeRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
