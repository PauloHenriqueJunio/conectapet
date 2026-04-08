"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Pet } from "@/types/api";
import { MessageCircle, Send, X } from "lucide-react";

interface AdoptionContactModalProps {
  open: boolean;
  pet: Pet;
  whatsappLink: string;
  hasWhatsappContact: boolean;
  onClose: () => void;
}

export function AdoptionContactModal({
  open,
  pet,
  whatsappLink,
  hasWhatsappContact,
  onClose,
}: AdoptionContactModalProps) {
  const { token, user } = useAuth();
  const canCreateAdoptionRequest = user?.role === "PESSOA_FISICA";

  const [adoptionMessage, setAdoptionMessage] = useState("");
  const [isSubmittingAdoption, setIsSubmittingAdoption] = useState(false);
  const [adoptionFeedback, setAdoptionFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!open) return;

    setAdoptionMessage(
      `Olá! Vi o perfil do(a) ${pet.name} no ConectaPet e tenho interesse em adotar. Posso receber mais informações sobre ele(a)?`,
    );
    setAdoptionFeedback(null);
  }, [open, pet.name]);

  const handleSubmitAdoptionMessage = async () => {
    if (!token) {
      setAdoptionFeedback({
        type: "error",
        message: "Você precisa estar logado para enviar uma mensagem.",
      });
      return;
    }

    if (!canCreateAdoptionRequest) {
      setAdoptionFeedback({
        type: "error",
        message: "Somente pessoas físicas podem solicitar adoção.",
      });
      return;
    }

    const trimmedMessage = adoptionMessage.trim();

    if (trimmedMessage.length < 10) {
      setAdoptionFeedback({
        type: "error",
        message: "Escreva uma mensagem com pelo menos 10 caracteres.",
      });
      return;
    }

    try {
      setIsSubmittingAdoption(true);
      setAdoptionFeedback(null);

      await apiFetch(
        "/adoptions",
        {
          method: "POST",
          body: JSON.stringify({
            petId: pet.id,
            message: trimmedMessage,
          }),
        },
        token,
      );

      setAdoptionFeedback({
        type: "success",
        message:
          "Mensagem enviada com sucesso! Acompanhe em suas solicitações.",
      });
    } catch (err) {
      const rawMessage = err instanceof Error ? err.message : "";
      const normalizedMessage = rawMessage.toLowerCase();

      if (
        normalizedMessage.includes("unique") ||
        normalizedMessage.includes("duplic")
      ) {
        setAdoptionFeedback({
          type: "error",
          message: "Você já enviou uma solicitação para este pet.",
        });
        return;
      }

      setAdoptionFeedback({
        type: "error",
        message:
          "Não foi possível enviar sua mensagem agora. Tente novamente em instantes.",
      });
    } finally {
      setIsSubmittingAdoption(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Fechar modal"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]"
      />

      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-5 sm:p-7 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Quero adotar {pet.name}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Escolha como deseja entrar em contato com o responsável pelo pet.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-10 w-10 rounded-full border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mb-5">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-2 text-emerald-700 font-bold">
              <MessageCircle size={18} />
              Falar no WhatsApp
            </div>
            <p className="text-sm text-emerald-800/80 mb-4 flex-1">
              Abre uma conversa com mensagem pronta, como funciona hoje.
            </p>

            {hasWhatsappContact ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-2.5 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Abrir WhatsApp
              </a>
            ) : (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                O responsável ainda não cadastrou um contato de WhatsApp.
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-2 text-brand-700 font-bold">
              <Send size={18} />
              Deixar mensagem
            </div>
            <p className="text-sm text-brand-900/80 mb-3">
              Envia sua mensagem para a ONG ou responsável e registra sua
              solicitação.
            </p>

            <textarea
              value={adoptionMessage}
              onChange={(e) => setAdoptionMessage(e.target.value)}
              placeholder="Conte por que você quer adotar e como pode cuidar do pet..."
              className="w-full min-h-[130px] resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
              maxLength={1200}
            />
            <div className="mt-2 text-right text-xs text-slate-400">
              {adoptionMessage.length}/1200
            </div>
          </div>
        </div>

        {adoptionFeedback && (
          <div
            className={`mb-4 rounded-xl border p-3 text-sm ${
              adoptionFeedback.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {adoptionFeedback.message}
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={handleSubmitAdoptionMessage}
            disabled={isSubmittingAdoption || !canCreateAdoptionRequest}
            className="px-4 py-2.5 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmittingAdoption ? "Enviando..." : "Enviar mensagem"}
          </button>
        </div>
      </div>
    </div>
  );
}
