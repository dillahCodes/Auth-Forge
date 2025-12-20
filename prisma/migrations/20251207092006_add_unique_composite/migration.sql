/*
  Warnings:

  - A unique constraint covering the columns `[userId,userAgent,ipAddress]` on the table `Sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Sessions_userId_userAgent_ipAddress_key" ON "Sessions"("userId", "userAgent", "ipAddress");
