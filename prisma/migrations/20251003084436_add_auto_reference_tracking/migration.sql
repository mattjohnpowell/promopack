-- CreateEnum
CREATE TYPE "public"."DocSource" AS ENUM ('USER_UPLOADED', 'PUBMED_AUTO', 'PUBMED_MANUAL', 'LIBRARY_REUSED');

-- AlterTable
ALTER TABLE "public"."Claim" ADD COLUMN     "auditReasoning" TEXT,
ADD COLUMN     "confidenceScore" DOUBLE PRECISION,
ADD COLUMN     "needsReview" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Document" ADD COLUMN     "acceptedAt" TIMESTAMP(3),
ADD COLUMN     "autoFoundForClaimId" TEXT,
ADD COLUMN     "confidenceScore" DOUBLE PRECISION,
ADD COLUMN     "isAutoFound" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "source" "public"."DocSource" NOT NULL DEFAULT 'USER_UPLOADED',
ADD COLUMN     "suggestedAt" TIMESTAMP(3);
