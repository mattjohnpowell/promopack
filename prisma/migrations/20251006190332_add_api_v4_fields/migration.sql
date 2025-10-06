-- AlterTable
ALTER TABLE "public"."Claim" ADD COLUMN     "citationPresent" BOOLEAN,
ADD COLUMN     "containsStatistics" BOOLEAN,
ADD COLUMN     "isComparative" BOOLEAN,
ADD COLUMN     "warnings" TEXT;
