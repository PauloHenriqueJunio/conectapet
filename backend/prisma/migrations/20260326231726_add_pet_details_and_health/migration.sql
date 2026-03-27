-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "hasHistoryOfIllness" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasOtherHealthInfo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "illnessDescription" TEXT,
ADD COLUMN     "otherHealthInfoDescription" TEXT,
ADD COLUMN     "sex" TEXT NOT NULL DEFAULT 'Indefinido',
ADD COLUMN     "size" TEXT NOT NULL DEFAULT 'Indefinido';
