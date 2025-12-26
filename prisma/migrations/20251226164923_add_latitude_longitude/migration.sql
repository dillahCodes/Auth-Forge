/*
  Warnings:

  - Added the required column `latitude` to the `Sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sessions" ADD COLUMN     "latitude" TEXT NOT NULL,
ADD COLUMN     "longitude" TEXT NOT NULL;
