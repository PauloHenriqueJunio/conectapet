-- Backfill existing users before enforcing the NOT NULL constraint.
UPDATE "User"
SET "cep" = '00000000'
WHERE "cep" IS NULL;

ALTER TABLE "User"
ALTER COLUMN "cep" SET NOT NULL;
