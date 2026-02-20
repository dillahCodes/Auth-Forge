/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `EmailChangeRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmailChangeRequest" DROP COLUMN "expiresAt";
