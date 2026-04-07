ALTER TABLE "Pet"
ADD COLUMN "photoUrls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "featuredPhotoIndex" INTEGER NOT NULL DEFAULT 0;

UPDATE "Pet"
SET "photoUrls" = CASE
  WHEN "photoUrl" IS NOT NULL AND "photoUrl" <> '' THEN ARRAY["photoUrl"]
  ELSE ARRAY[]::TEXT[]
END,
"featuredPhotoIndex" = 0;
