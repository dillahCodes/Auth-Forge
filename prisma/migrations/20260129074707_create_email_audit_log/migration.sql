-- CreateTable
CREATE TABLE "EmailChangeAuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionid" TEXT NOT NULL,
    "oldEmail" TEXT NOT NULL,
    "newEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailChangeAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailChangeAuditLog_oldEmail_key" ON "EmailChangeAuditLog"("oldEmail");

-- CreateIndex
CREATE UNIQUE INDEX "EmailChangeAuditLog_newEmail_key" ON "EmailChangeAuditLog"("newEmail");

-- AddForeignKey
ALTER TABLE "EmailChangeAuditLog" ADD CONSTRAINT "EmailChangeAuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailChangeAuditLog" ADD CONSTRAINT "EmailChangeAuditLog_sessionid_fkey" FOREIGN KEY ("sessionid") REFERENCES "Sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
