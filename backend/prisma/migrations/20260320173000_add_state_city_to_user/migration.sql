-- Persist CEP enrichment fields to avoid N+1 calls in frontend
ALTER TABLE "User"
ADD COLUMN "state" TEXT,
ADD COLUMN "city" TEXT;
