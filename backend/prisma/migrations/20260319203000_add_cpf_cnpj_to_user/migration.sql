-- Add optional CPF and CNPJ identifiers to users.
ALTER TABLE "User"
ADD COLUMN "cpf" TEXT,
ADD COLUMN "cnpj" TEXT;

-- Keep each identifier unique when provided.
CREATE UNIQUE INDEX "User_cpf_key" ON "User"("cpf");
CREATE UNIQUE INDEX "User_cnpj_key" ON "User"("cnpj");
