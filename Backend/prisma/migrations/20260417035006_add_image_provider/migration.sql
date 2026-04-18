-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "imageProvider" TEXT NOT NULL DEFAULT 'cloudinary';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "imageProvider" TEXT NOT NULL DEFAULT 'cloudinary';
