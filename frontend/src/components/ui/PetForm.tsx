"use client";

import { FormEvent, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle, CheckCircle2, Loader2, PawPrint } from "lucide-react";
import { ImageUpload, PetPhotoPreviewItem } from "@/components/ui/ImageUpload";
import { HealthChecklist } from "@/components/ui/HealthCheckList";

interface PetFormProps {
  initialData?: any;
  onSubmitSuccess: () => void;
}

export function PetForm({ initialData, onSubmitSuccess }: PetFormProps) {
  const { token } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [petPhotos, setPetPhotos] = useState<
    Array<PetPhotoPreviewItem & { file?: File; existingUrl?: string }>
  >(() => {
    const initialUrls: string[] = Array.isArray(initialData?.photoUrls)
      ? initialData.photoUrls
      : initialData?.photoUrl
        ? [initialData.photoUrl]
        : [];

    return initialUrls.slice(0, 5).map((url, index) => ({
      id: `existing-${index}-${url}`,
      previewUrl: url,
      existingUrl: url,
      isExisting: true,
    }));
  });

  const [featuredPhotoIndex, setFeaturedPhotoIndex] = useState(() => {
    const initialIndex = Number(initialData?.featuredPhotoIndex ?? 0);
    if (!Number.isFinite(initialIndex) || initialIndex < 0) return 0;
    return initialIndex;
  });

  const [petForm, setPetForm] = useState({
    name: initialData?.name || "",
    species: initialData?.species || "",
    sex: initialData?.sex || "",
    size: initialData?.size || "",
    age: initialData?.age || 0,
    donationReason: initialData?.donationReason || "",
    description: initialData?.description || "",
    hasHistoryOfIllness: initialData?.hasHistoryOfIllness || false,
    illnessDescription: initialData?.illnessDescription || "",
    hasOtherHealthInfo: initialData?.hasOtherHealthInfo || false,
    otherHealthInfoDescription: initialData?.otherHealthInfoDescription || "",
    isCastrated: initialData?.isCastrated || false,
    isDewormed: initialData?.isDewormed || false,
    hasVaccineV8: initialData?.hasVaccineV8 || false,
    hasVaccineRabies: initialData?.hasVaccineRabies || false,
    hasVaccineGiardia: initialData?.hasVaccineGiardia || false,
    hasVaccineFlu: initialData?.hasVaccineFlu || false,
    hasVaccineFeline: initialData?.hasVaccineFeline || false,
    hasVaccineFelv: initialData?.hasVaccineFelv || false,
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

  const handleAddPhoto = (file: File, previewUrl: string) => {
    setPetPhotos((prev) => {
      if (prev.length >= 5) {
        URL.revokeObjectURL(previewUrl);
        setError("Você pode adicionar no máximo 5 fotos por pet.");
        return prev;
      }

      const next = [
        ...prev,
        {
          id: `new-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          previewUrl,
          file,
          isExisting: false,
        },
      ];

      if (next.length === 1) {
        setFeaturedPhotoIndex(0);
      }

      return next;
    });
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setPetPhotos((prev) => {
      const removed = prev[indexToRemove];
      if (!removed) return prev;

      if (!removed.isExisting) {
        URL.revokeObjectURL(removed.previewUrl);
      }

      const next = prev.filter((_, index) => index !== indexToRemove);

      setFeaturedPhotoIndex((currentFeatured) => {
        if (next.length === 0) return 0;
        if (currentFeatured === indexToRemove) return 0;
        if (currentFeatured > indexToRemove) return currentFeatured - 1;
        if (currentFeatured >= next.length) return next.length - 1;
        return currentFeatured;
      });

      return next;
    });
  };

  const handleSetFeatured = (index: number) => {
    setFeaturedPhotoIndex(index);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

      const retainedPhotoUrls = petPhotos
        .filter((photo) => photo.isExisting && photo.existingUrl)
        .map((photo) => photo.existingUrl as string);

      const newPhotoFiles = petPhotos
        .filter((photo) => !photo.isExisting && photo.file)
        .map((photo) => photo.file as File);

      formData.append("retainedPhotoUrls", JSON.stringify(retainedPhotoUrls));
      formData.append("featuredPhotoIndex", String(featuredPhotoIndex));

      newPhotoFiles.forEach((file) => {
        formData.append("photos", file);
      });

      const url = initialData
        ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/pets/${initialData.id}`
        : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/pets`;

      const method = initialData ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Falha ao salvar o pet no servidor");

      setSuccess(
        initialData
          ? "Pet atualizado com sucesso!"
          : "Pet adicionado com sucesso!",
      );

      setTimeout(() => {
        onSubmitSuccess();
      }, 1500);
    } catch {
      setError("Não foi possível salvar os dados do pet.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
        <ImageUpload
          photos={petPhotos}
          featuredPhotoIndex={featuredPhotoIndex}
          onAddPhoto={handleAddPhoto}
          onRemovePhoto={handleRemovePhoto}
          onSetFeatured={handleSetFeatured}
          onError={setError}
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
              className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
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
              className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
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
              className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
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
              className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
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
              className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
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
              className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Ex: Encontrei na rua, mudança..."
              value={petForm.donationReason}
              onChange={handleChange}
            />
          </div>
        </div>

        <HealthChecklist
          species={petForm.species}
          isCastrated={petForm.isCastrated}
          isDewormed={petForm.isDewormed}
          hasVaccineV8={petForm.hasVaccineV8}
          hasVaccineRabies={petForm.hasVaccineRabies}
          hasVaccineGiardia={petForm.hasVaccineGiardia}
          hasVaccineFlu={petForm.hasVaccineFlu}
          hasVaccineFeline={petForm.hasVaccineFeline}
          hasVaccineFelv={petForm.hasVaccineFelv}
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
            className="resize-none rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Conte um pouco sobre a história do pet..."
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
                <Loader2 className="h-5 w-5 animate-spin" /> Salvando...
              </>
            ) : (
              <>
                <PawPrint className="h-5 w-5" />{" "}
                {initialData ? "Salvar Alterações" : "Cadastrar Pet"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
