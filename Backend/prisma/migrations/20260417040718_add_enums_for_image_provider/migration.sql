/*
  Warnings:

  - The `imageProvider` column on the `Photo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `imageProvider` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "imageProvider" AS ENUM ('cloudinary');

-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "imageProvider",
ADD COLUMN     "imageProvider" "imageProvider" NOT NULL DEFAULT 'cloudinary';

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "imageProvider",
ADD COLUMN     "imageProvider" "imageProvider" NOT NULL DEFAULT 'cloudinary';
