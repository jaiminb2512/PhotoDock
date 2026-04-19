/*
  Warnings:

  - A unique constraint covering the columns `[currentUsageId]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "currentUsageId" TEXT,
ADD COLUMN     "planExpires" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Project_currentUsageId_key" ON "Project"("currentUsageId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_currentUsageId_fkey" FOREIGN KEY ("currentUsageId") REFERENCES "Usage"("usageId") ON DELETE SET NULL ON UPDATE CASCADE;
