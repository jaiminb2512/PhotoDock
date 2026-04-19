-- CreateEnum
CREATE TYPE "billingCycle" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "usageStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "planId" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "billingCycle" "billingCycle" NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "maxPhotos" INTEGER NOT NULL,
    "monthlyPhotoUploads" INTEGER NOT NULL,
    "onlineBookingAllowed" BOOLEAN NOT NULL,
    "maxOnlineBookingAllowed" INTEGER,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("planId")
);

-- CreateTable
CREATE TABLE "Usage" (
    "usageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "maxPhotos" INTEGER NOT NULL,
    "monthlyPhotoUploadsLimit" INTEGER NOT NULL,
    "maxOnlineBookingAllowed" INTEGER,
    "monthlyPhotoUploadsUsed" INTEGER NOT NULL DEFAULT 0,
    "onlineBookingsUsed" INTEGER NOT NULL DEFAULT 0,
    "status" "usageStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usage_pkey" PRIMARY KEY ("usageId")
);

-- AddForeignKey
ALTER TABLE "Usage" ADD CONSTRAINT "Usage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usage" ADD CONSTRAINT "Usage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("projectId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usage" ADD CONSTRAINT "Usage_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubscriptionPlan"("planId") ON DELETE RESTRICT ON UPDATE CASCADE;
