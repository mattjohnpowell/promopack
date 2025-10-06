-- CreateEnum
CREATE TYPE "public"."ClaimStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'EDITED');

-- CreateEnum
CREATE TYPE "public"."ClaimType" AS ENUM ('EFFICACY', 'SAFETY', 'INDICATION', 'COMPARATIVE', 'PHARMACOKINETIC', 'DOSING', 'CONTRAINDICATION', 'MECHANISM', 'DRUG_INTERACTION', 'OTHER');

-- AlterTable
ALTER TABLE "public"."Claim" ADD COLUMN     "claimType" "public"."ClaimType",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "editedText" TEXT,
ADD COLUMN     "extractionConfidence" DOUBLE PRECISION,
ADD COLUMN     "extractionReasoning" TEXT,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedBy" TEXT,
ADD COLUMN     "status" "public"."ClaimStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
ADD COLUMN     "suggestedType" "public"."ClaimType";
