/*
  Warnings:

  - You are about to drop the column `sessionsId` on the `EmailChangeAuditLog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "EmailChangeAuditLog" DROP CONSTRAINT "EmailChangeAuditLog_sessionsId_fkey";

-- DropIndex
DROP INDEX "EmailChangeAuditLog_sessionsId_idx";

-- AlterTable
ALTER TABLE "EmailChangeAuditLog" DROP COLUMN "sessionsId",
ADD COLUMN     "sessionId" TEXT;

-- CreateIndex
CREATE INDEX "EmailChangeAuditLog_sessionId_idx" ON "EmailChangeAuditLog"("sessionId");

-- AddForeignKey
ALTER TABLE "EmailChangeAuditLog" ADD CONSTRAINT "EmailChangeAuditLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
