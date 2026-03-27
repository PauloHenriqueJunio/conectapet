"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, PawPrint } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { HealthChecklist } from "@/components/ui/HealthCheckList";

export default function CadastrarPetPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [petForm, setPetForm] = useState({
    name: "",
    species: "",
    sex: "",
    size: "",
    age: 0,
    donationReason: "",
    description: "",
    hasHistoryOfIllness: false,
    illnessDescription: "",
    hasOtherHealthInfo: false,
    otherHealthInfoDescription: "",
    isCastrated: false,
    isDewormed: false,
    hasVaccineV8: false,
    hasVaccineRabies: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { id, value } = e.target;
    const finalValue = id === "age" ? Number(value) : value;

    setPetForm((prev) => ({ ...prev, [id]: finalValue }));
  };

  const handleHealthChange = (field: string, value: boolean | string) => {
    setPetForm((prev) => {
      if (field === "hasHistoryOfIllness" && value === false) {
        return { ...prev, [field]: value, illnessDescription: "" };
      }
      if (field === "hasOtherHealthInfo" && value === false) {
        return { ...prev, [field]: value, otherHealthInfoDescription: "" };
      }

      return { ...prev, [field]: value };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // (Max 5MB = 5 * 1024 * 1024 bytes)
        setError("Tamanho máximo permitido é de 5MB.");
        e.target.value = "";
        return;
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setError("Apenas imagens JPG, PNG ou WEBP.");
        e.target.value = "";
        return;
      }

      setPhotoFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPhotoPreview(objectUrl);
    }
  };

  const handleAddPet = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;

    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      Object.entries(petForm).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/pets`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Falha ao salvar o pet no servidor");
      }

      setSuccess("Pet adicionado com sucesso!");

      setPetForm({
        name: "",
        species: "",
        sex: "",
        size: "",
        age: 0,
        donationReason: "",
        description: "",
        hasHistoryOfIllness: false,
        illnessDescription: "",
        hasOtherHealthInfo: false,
        otherHealthInfoDescription: "",
        isCastrated: false,
        isDewormed: false,
        hasVaccineV8: false,
        hasVaccineRabies: false,
      });
      setPhotoPreview(null);
      setPhotoFile(null);

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch {
      setError("Não foi possível adicionar o pet.");
      setIsSubmitting(false);
    }
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

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 shadow-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700 shadow-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 w-full">
        <form onSubmit={handleAddPet} className="flex flex-col gap-8 w-full">
          <ImageUpload
            photoPreview={photoPreview}
            onFileChange={handleFileChange}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="text-sm font-semibold text-slate-700"
              >
                Nome do Pet <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Ex: Rex, Luna..."
                value={petForm.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="species"
                className="text-sm font-semibold text-slate-700"
              >
                Espécie <span className="text-red-500">*</span>
              </label>
              <select
                id="species"
                className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                value={petForm.species}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Selecione a espécie...
                </option>
                <option value="Cão">Cão</option>
                <option value="Gato">Gato</option>
                <option value="Ave">Ave</option>
                <option value="Roedor">Roedor</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="sex"
                className="text-sm font-semibold text-slate-700"
              >
                Sexo <span className="text-red-500">*</span>
              </label>
              <select
                id="sex"
                className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                value={petForm.sex}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Selecione o sexo...
                </option>
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="size"
                className="text-sm font-semibold text-slate-700"
              >
                Porte <span className="text-red-500">*</span>
              </label>
              <select
                id="size"
                className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                value={petForm.size}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Selecione o porte...
                </option>
                <option value="Pequeno">Pequeno</option>
                <option value="Médio">Médio</option>
                <option value="Grande">Grande</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="age"
                className="text-sm font-semibold text-slate-700"
              >
                Idade (anos) <span className="text-red-500">*</span>
              </label>
              <input
                id="age"
                type="number"
                min={0}
                className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                placeholder="0"
                value={petForm.age === 0 ? "" : petForm.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="donationReason"
                className="text-sm font-semibold text-slate-700"
              >
                Motivo da doação{" "}
                <span className="font-normal text-slate-400">(opcional)</span>
              </label>
              <input
                id="donationReason"
                className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Ex: Encontrei na rua, mudança..."
                value={petForm.donationReason}
                onChange={handleChange}
              />
            </div>
          </div>

          <HealthChecklist
            isCastrated={petForm.isCastrated}
            isDewormed={petForm.isDewormed}
            hasVaccineV8={petForm.hasVaccineV8}
            hasVaccineRabies={petForm.hasVaccineRabies}
            hasHistoryOfIllness={petForm.hasHistoryOfIllness}
            hasOtherHealthInfo={petForm.hasOtherHealthInfo}
            otherHealthInfoDescription={petForm.otherHealthInfoDescription}
            illnessDescription={petForm.illnessDescription}
            onChange={handleHealthChange}
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="description"
              className="text-sm font-semibold text-slate-700"
            >
              Descrição e personalidade <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              rows={4}
              className="resize-none rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Conte um pouco sobre a história do pet, seu comportamento e necessidades especiais..."
              value={petForm.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mt-2 flex justify-start border-t border-slate-100 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <PawPrint className="h-5 w-5" />
                  Cadastrar Pet
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
