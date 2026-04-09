"use client";

import { useRouter } from "next/navigation";
import { PetForm } from "@/components/ui/PetForm";

interface CreatePetPageContentProps {
  redirectPath: string;
}

export function CreatePetPageContent({
  redirectPath,
}: CreatePetPageContentProps) {
  const router = useRouter();

  const handleSuccess = () => {
    router.push(redirectPath);
  };

  return (
    <div className="max-w-full text-left px-4 sm:px-0">
      <div className="mb-8 border-b border-slate-200 pb-5">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Cadastrar Novo Pet
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Preencha os dados abaixo para disponibilizar um novo animal para
          adoção responsável.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 w-full">
        <PetForm onSubmitSuccess={handleSuccess} />
      </section>
    </div>
  );
}
