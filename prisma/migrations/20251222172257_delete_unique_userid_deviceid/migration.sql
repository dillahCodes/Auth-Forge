-- DropIndex
DROP INDEX "Sessions_userId_deviceId_key";

-- CreateIndex
CREATE INDEX "Sessions_deviceId_idx" ON "Sessions"("deviceId");
