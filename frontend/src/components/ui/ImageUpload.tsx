import { useEffect, useRef, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Image as ImageIcon, UploadCloud, Move } from "lucide-react";

interface ImageUploadProps {
  photoPreview: string | null;
  onFileChange: (file: File | null, previewUrl: string | null) => void;
  onError: (message: string | null) => void;
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Falha ao carregar imagem."));
    image.src = url;
  });
}

async function getCroppedBlob(imageSrc: string, crop: Area): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");

  canvas.width = crop.width;
  canvas.height = crop.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Não foi possível processar a imagem.");
  }

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Não foi possível gerar a prévia da imagem."));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      0.92,
    );
  });
}

export function ImageUpload({
  photoPreview,
  onFileChange,
  onError,
}: ImageUploadProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.2);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [livePreview, setLivePreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const selectedImageUrlRef = useRef<string | null>(null);
  const livePreviewRef = useRef<string | null>(null);

  useEffect(() => {
    selectedImageUrlRef.current = selectedImageUrl;
  }, [selectedImageUrl]);

  useEffect(() => {
    livePreviewRef.current = livePreview;
  }, [livePreview]);

  useEffect(() => {
    if (!selectedImageUrl || !croppedAreaPixels || !isEditing) {
      return;
    }

    const timer = window.setTimeout(async () => {
      try {
        const blob = await getCroppedBlob(selectedImageUrl, croppedAreaPixels);
        const nextPreview = URL.createObjectURL(blob);
        setLivePreview((current) => {
          if (current) URL.revokeObjectURL(current);
          return nextPreview;
        });
      } catch {
        onError("Não foi possível gerar a prévia da imagem.");
      }
    }, 100);

    return () => window.clearTimeout(timer);
  }, [selectedImageUrl, croppedAreaPixels, isEditing, onError]);

  useEffect(() => {
    return () => {
      if (selectedImageUrlRef.current) {
        URL.revokeObjectURL(selectedImageUrlRef.current);
      }
      if (livePreviewRef.current) {
        URL.revokeObjectURL(livePreviewRef.current);
      }
    };
  }, []);

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    onError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      onError("Tamanho máximo permitido é de 5MB.");
      e.target.value = "";
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      onError("Apenas imagens JPG, PNG ou WEBP.");
      e.target.value = "";
      return;
    }

    if (selectedImageUrl) URL.revokeObjectURL(selectedImageUrl);
    if (livePreview) {
      URL.revokeObjectURL(livePreview);
      setLivePreview(null);
    }

    setSelectedImageUrl(URL.createObjectURL(file));
    setCrop({ x: 0, y: 0 });
    setZoom(1.2);
    setIsEditing(true);
    e.target.value = "";
  };

  const handleApplyCrop = async () => {
    if (!selectedImageUrl || !croppedAreaPixels) {
      onError("Selecione e ajuste uma imagem antes de aplicar.");
      return;
    }

    try {
      const blob = await getCroppedBlob(selectedImageUrl, croppedAreaPixels);
      const finalPreview = URL.createObjectURL(blob);
      const file = new File([blob], `pet-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      onFileChange(file, finalPreview);
      setIsEditing(false);

      if (selectedImageUrl) {
        URL.revokeObjectURL(selectedImageUrl);
        setSelectedImageUrl(null);
      }
      if (livePreview) {
        URL.revokeObjectURL(livePreview);
        setLivePreview(null);
      }
    } catch {
      onError("Não foi possível aplicar o enquadramento da imagem.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (selectedImageUrl) {
      URL.revokeObjectURL(selectedImageUrl);
      setSelectedImageUrl(null);
    }
    if (livePreview) {
      URL.revokeObjectURL(livePreview);
      setLivePreview(null);
    }
  };

  const previewSource = livePreview || selectedImageUrl || photoPreview;

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">Foto do Pet</p>
          <p className="text-xs text-slate-500">PNG, JPG ou WEBP ate 5MB</p>
        </div>
        <label
          htmlFor="photo-upload"
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50"
        >
          <UploadCloud className="h-4 w-4" />
          {photoPreview ? "Trocar foto" : "Selecionar foto"}
        </label>
        <input
          id="photo-upload"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleSelectFile}
        />
      </div>

      {isEditing && selectedImageUrl ? (
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-3">
            <div className="relative h-56 overflow-hidden rounded-xl bg-slate-900">
              <Cropper
                image={selectedImageUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_croppedArea: Area, areaPixels: Area) =>
                  setCroppedAreaPixels(areaPixels)
                }
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Move className="h-3.5 w-3.5" /> Arraste para centralizar
                </span>
                <span>Zoom: {zoom.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleApplyCrop}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Aplicar enquadramento
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancelar
              </button>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-3">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Prévias do foto do pet
            </p>
            <div className="flex flex-wrap items-end justify-center gap-3">
              {[56, 72, 96].map((size, index) => (
                <div key={size} className="flex flex-col items-center gap-2">
                  <div
                    className="overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100"
                    style={{ width: size, height: size }}
                  >
                    {previewSource ? (
                      <img
                        src={previewSource}
                        alt="Previa da foto do pet"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <ImageIcon className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {index === 0 ? "Pequena" : index === 1 ? "Média" : "Grande"}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Pagina do pet (vertical)
              </p>
              <div className="mx-auto w-full max-w-[180px]">
                <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                  <div className="relative min-h-[240px] bg-slate-100">
                    {previewSource ? (
                      <img
                        src={previewSource}
                        alt="Preview vertical da foto do pet"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-white p-3">
          <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Foto atual do pet"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <ImageIcon className="h-7 w-7" />
              </div>
            )}
          </div>
          <div className="text-sm text-slate-600">
            <p className="font-medium text-slate-700">
              {photoPreview
                ? "A foto ja esta pronta. Clique em Trocar foto para ajustar outra."
                : "Selecione uma foto e ajuste o enquadramento em formato de perfil."}
            </p>
            <p className="text-xs text-slate-500">
              Apos selecionar, arraste e aplique para ver como vai ficar.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
