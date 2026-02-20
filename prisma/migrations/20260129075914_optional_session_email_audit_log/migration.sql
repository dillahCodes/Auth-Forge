/*
  Warnings:

  - You are about to drop the column `sessionid` on the `EmailChangeAuditLog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "EmailChangeAuditLog" DROP CONSTRAINT "EmailChangeAuditLog_sessionid_fkey";

-- DropIndex
DROP INDEX "EmailChangeAuditLog_newEmail_key";

-- DropIndex
DROP INDEX "EmailChangeAuditLog_oldEmail_key";

-- AlterTable
ALTER TABLE "EmailChangeAuditLog" DROP COLUMN "sessionid",
ADD COLUMN     "sessionsId" TEXT;

-- AddForeignKey
ALTER TABLE "EmailChangeAuditLog" ADD CONSTRAINT "EmailChangeAuditLog_sessionsId_fkey" FOREIGN KEY ("sessionsId") REFERENCES "Sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
