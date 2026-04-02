/*
  Warnings:

  - Added the required column `setNo` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "setNo" INTEGER NOT NULL,
ALTER COLUMN "photoName" DROP NOT NULL,
ALTER COLUMN "photoDescription" DROP NOT NULL;
