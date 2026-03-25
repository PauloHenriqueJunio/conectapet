import { UploadCloud, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  photoPreview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ImageUpload({ photoPreview, onFileChange }: ImageUploadProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-slate-700">Foto do Pet</span>
      <label
        htmlFor="photo-upload"
        className="group relative flex h-40 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition-all hover:border-emerald-500 hover:bg-emerald-50/50"
      >
        {photoPreview ? (
          <>
            <img
              src={photoPreview}
              alt="Preview do Pet"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <p className="flex items-center gap-2 font-medium text-white">
                <UploadCloud className="h-5 w-5" />
                Trocar foto
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-emerald-600">
            <div className="rounded-full bg-slate-100 p-3 transition-colors group-hover:bg-emerald-100">
              <ImageIcon className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">
                Clique para selecionar uma foto
              </p>
              <p className="mt-1 text-xs text-slate-400">
                PNG, JPG ou WEBP (Máx. 5MB)
              </p>
            </div>
          </div>
        )}
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />
      </label>
    </div>
  );
}
