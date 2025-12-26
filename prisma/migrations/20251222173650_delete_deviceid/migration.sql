/*
  Warnings:

  - You are about to drop the column `deviceId` on the `Sessions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Sessions_deviceId_idx";

-- AlterTable
ALTER TABLE "Sessions" DROP COLUMN "deviceId";
