/*
  Warnings:

  - You are about to drop the `PhotographerProfile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `displayMessage` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."PhotographerProfile" DROP CONSTRAINT "PhotographerProfile_projectId_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "displayMessage" TEXT NOT NULL,
ADD COLUMN     "facebookUrl" TEXT,
ADD COLUMN     "instagramUrl" TEXT,
ADD COLUMN     "tagline" TEXT,
ADD COLUMN     "twitterUrl" TEXT;

-- DropTable
DROP TABLE "public"."PhotographerProfile";
