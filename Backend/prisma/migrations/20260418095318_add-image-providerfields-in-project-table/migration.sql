-- AlterTable for Photo
ALTER TABLE "Photo" DROP COLUMN "imageProvider",
ADD COLUMN     "imageProvider" "imageProvider" NOT NULL DEFAULT 'cloudinary';

-- 1. Create the new columns initially (as nullable to allow for data migration)
ALTER TABLE "Project" 
ADD COLUMN "currentImageProvider" "imageProvider",
ADD COLUMN "oldImageProvider" "imageProvider";

-- 2. Copy data from the old imageProvider field to the new fields
UPDATE "Project" 
SET "currentImageProvider" = CAST("imageProvider" AS TEXT)::"imageProvider", 
    "oldImageProvider" = CAST("imageProvider" AS TEXT)::"imageProvider";

-- 3. In case any existing records had null (if the old field was optional), set them to default
UPDATE "Project" 
SET "currentImageProvider" = 'cloudinary' WHERE "currentImageProvider" IS NULL;
UPDATE "Project" 
SET "oldImageProvider" = 'cloudinary' WHERE "oldImageProvider" IS NULL;

-- 4. Make the new columns mandatory (NOT NULL) and set their defaults
ALTER TABLE "Project" 
ALTER COLUMN "currentImageProvider" SET NOT NULL,
ALTER COLUMN "currentImageProvider" SET DEFAULT 'cloudinary',
ALTER COLUMN "oldImageProvider" SET NOT NULL,
ALTER COLUMN "oldImageProvider" SET DEFAULT 'cloudinary';

-- 5. Finally, remove the old imageProvider field
ALTER TABLE "Project" DROP COLUMN "imageProvider";
