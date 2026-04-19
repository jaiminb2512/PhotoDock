/*
  Warnings:

  - You are about to drop the column `planExpires` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "planExpires",
ADD COLUMN     "planEndDate" TIMESTAMP(3);
