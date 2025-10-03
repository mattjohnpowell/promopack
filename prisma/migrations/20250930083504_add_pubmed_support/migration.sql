/*
  Warnings:

  - A unique constraint covering the columns `[pubmedId]` on the table `Document` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[doi]` on the table `Document` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Document" ADD COLUMN     "abstract" TEXT,
ADD COLUMN     "authors" TEXT,
ADD COLUMN     "doi" TEXT,
ADD COLUMN     "issue" TEXT,
ADD COLUMN     "journal" TEXT,
ADD COLUMN     "pages" TEXT,
ADD COLUMN     "pubmedId" TEXT,
ADD COLUMN     "pubmedUrl" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "volume" TEXT,
ADD COLUMN     "year" INTEGER,
ALTER COLUMN "url" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Document_pubmedId_key" ON "public"."Document"("pubmedId");

-- CreateIndex
CREATE UNIQUE INDEX "Document_doi_key" ON "public"."Document"("doi");
