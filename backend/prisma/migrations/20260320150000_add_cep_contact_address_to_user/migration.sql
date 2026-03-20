-- Add registration fields required for ONG details and CEP validation
ALTER TABLE "User"
ADD COLUMN "cep" TEXT,
ADD COLUMN "contact" TEXT,
ADD COLUMN "address" TEXT;
