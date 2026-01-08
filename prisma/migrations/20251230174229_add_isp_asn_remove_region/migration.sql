/*
  Warnings:

  - You are about to drop the column `region` on the `Sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sessions" DROP COLUMN "region",
ADD COLUMN     "asn" INTEGER,
ADD COLUMN     "isp" TEXT;
