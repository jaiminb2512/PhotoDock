/*
  Warnings:

  - A unique constraint covering the columns `[projectId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `projectId` on table `Photo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `projectId` on table `Service` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "role" AS ENUM ('ADMIN', 'USER');

-- DropForeignKey
ALTER TABLE "public"."Photo" DROP CONSTRAINT "Photo_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Service" DROP CONSTRAINT "Service_projectId_fkey";

-- AlterTable
ALTER TABLE "Photo" ALTER COLUMN "projectId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "projectId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "projectId" TEXT,
ADD COLUMN     "role" "role" NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE UNIQUE INDEX "User_projectId_key" ON "User"("projectId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("projectId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("projectId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("projectId") ON DELETE RESTRICT ON UPDATE CASCADE;
