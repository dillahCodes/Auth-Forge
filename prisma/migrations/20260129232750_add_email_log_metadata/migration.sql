-- AlterTable
ALTER TABLE "EmailChangeAuditLog" ADD COLUMN     "asn" INTEGER,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "continent" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "countryRegion" TEXT,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "isp" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "userAgent" TEXT;

-- CreateIndex
CREATE INDEX "EmailChangeAuditLog_userId_idx" ON "EmailChangeAuditLog"("userId");

-- CreateIndex
CREATE INDEX "EmailChangeAuditLog_sessionsId_idx" ON "EmailChangeAuditLog"("sessionsId");
