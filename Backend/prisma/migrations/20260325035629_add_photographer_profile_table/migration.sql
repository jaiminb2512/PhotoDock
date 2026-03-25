-- CreateTable
CREATE TABLE "PhotographerProfile" (
    "profileId" TEXT NOT NULL,
    "displayMessage" TEXT NOT NULL,
    "tagline" TEXT,
    "projectId" TEXT NOT NULL,
    "twitterUrl" TEXT,
    "instagramUrl" TEXT,
    "facebookUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhotographerProfile_pkey" PRIMARY KEY ("profileId")
);

-- CreateIndex
CREATE UNIQUE INDEX "PhotographerProfile_projectId_key" ON "PhotographerProfile"("projectId");

-- AddForeignKey
ALTER TABLE "PhotographerProfile" ADD CONSTRAINT "PhotographerProfile_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("projectId") ON DELETE RESTRICT ON UPDATE CASCADE;
