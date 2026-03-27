-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "hasVaccineFeline" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasVaccineFelv" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasVaccineFlu" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasVaccineGiardia" BOOLEAN NOT NULL DEFAULT false;
