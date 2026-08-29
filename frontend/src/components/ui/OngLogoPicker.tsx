"use client";

import { useRef, useState } from "react";
import { Building2, Camera, Check } from "lucide-react";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface OngLogoPickerProps {
  previewUrl: string | null;
  onFileSelected: (file: File) => void;
  disabled?: boolean;
  /** Quando informado, mostra um botao "Salvar" dentro do proprio card assim
   *  que uma nova foto e escolhida (usado na edicao de perfil, onde o envio
   *  nao e mais automatico). No cadastro esse prop fica de fora: a foto so
   *  sobe depois que a conta e criada. */
  onSave?: () => void;
  hasPendingChange?: boolean;
  isSaving?: boolean;
  justSaved?: boolean;
}

/** Seletor de logo/foto da ONG, usado no cadastro e na edicao de perfil.
 *  So guarda o arquivo escolhido e mostra a previa; quem chama decide
 *  quando (e se) de fato envia pro backend. */
export function OngLogoPicker({
  previewUrl,
  onFileSelected,
  disabled,
  onSave,
  hasPendingChange,
  isSaving,
  justSaved,
}: OngLogoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setError("Apenas imagens JPG, PNG ou WEBP.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Tamanho máximo permitido é de 5MB.");
      return;
    }

    setError(null);
    onFileSelected(file);
  };

  return (
    <div>
      <p className="mb-2 block text-sm font-medium text-slate-700">
        Foto ou logo da ONG
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Prévia da foto da ONG"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-300">
              <Building2 size={32} />
            </div>
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-3 py-2 text-sm font-semibold text-brand-700 transition hover:border-brand-300 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Camera size={16} />
            {previewUrl ? "Trocar foto" : "Adicionar foto"}
          </button>
          <p className="mt-1.5 text-xs text-slate-500">
            PNG, JPG ou WEBP até 5MB. Opcional.
          </p>
        </div>

        {onSave && hasPendingChange && (
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Salvando..." : "Salvar"}
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {justSaved && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-brand-600">
          <Check size={14} />
          Imagem salva com sucesso!
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
