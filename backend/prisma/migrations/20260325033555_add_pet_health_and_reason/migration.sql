-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "donationReason" TEXT,
ADD COLUMN     "hasVaccineRabies" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasVaccineV8" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isCastrated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDewormed" BOOLEAN NOT NULL DEFAULT false;
