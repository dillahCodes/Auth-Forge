-- DropIndex
DROP INDEX "EmailChangeRequest_createdAt_idx";

-- DropIndex
DROP INDEX "EmailChangeRequest_userId_key";

-- CreateIndex
CREATE INDEX "EmailChangeRequest_userId_createdAt_idx" ON "EmailChangeRequest"("userId", "createdAt");
