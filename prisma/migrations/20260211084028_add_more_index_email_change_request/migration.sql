/*
  Warnings:

  - A unique constraint covering the columns `[userId,reqStatus]` on the table `EmailChangeRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "EmailChangeRequest_reqStatus_idx" ON "EmailChangeRequest"("reqStatus");

-- CreateIndex
CREATE UNIQUE INDEX "EmailChangeRequest_userId_reqStatus_key" ON "EmailChangeRequest"("userId", "reqStatus");
