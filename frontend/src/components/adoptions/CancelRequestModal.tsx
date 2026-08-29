"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { AdoptionRequest } from "@/types/api";

interface CancelRequestModalProps {
  request: AdoptionRequest | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export function CancelRequestModal({
  request,
  onClose,
  onConfirm,
}: CancelRequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!request) {
    return null;
  }

  const petName = request.pet?.name ?? "este pet";

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(request.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto p-4 sm:p-6">
      <button
        type="button"
        aria-label="Fechar modal"
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-[2px]"
      />

      <div className="flex min-h-full items-center justify-center">
        <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
              <AlertTriangle size={22} />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={18} />
            </button>
          </div>

          <h2 className="text-xl font-extrabold text-slate-900">
            Cancelar solicitação?
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Tem certeza que deseja cancelar seu pedido de adoção do(a){" "}
            <span className="font-semibold text-slate-700">{petName}</span>?
            Essa ação não pode ser desfeita — se mudar de ideia, você
            precisará enviar uma nova solicitação.
          </p>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Cancelando..." : "Sim, cancelar solicitação"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
