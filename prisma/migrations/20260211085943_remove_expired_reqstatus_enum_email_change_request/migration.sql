/*
  Warnings:

  - The values [EXPIRED] on the enum `ReqStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReqStatus_new" AS ENUM ('PENDING', 'COMPLETED', 'CANCELED');
ALTER TABLE "public"."EmailChangeRequest" ALTER COLUMN "reqStatus" DROP DEFAULT;
ALTER TABLE "EmailChangeRequest" ALTER COLUMN "reqStatus" TYPE "ReqStatus_new" USING ("reqStatus"::text::"ReqStatus_new");
ALTER TYPE "ReqStatus" RENAME TO "ReqStatus_old";
ALTER TYPE "ReqStatus_new" RENAME TO "ReqStatus";
DROP TYPE "public"."ReqStatus_old";
ALTER TABLE "EmailChangeRequest" ALTER COLUMN "reqStatus" SET DEFAULT 'PENDING';
COMMIT;
