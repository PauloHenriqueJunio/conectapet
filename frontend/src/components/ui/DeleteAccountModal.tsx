"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface DeleteAccountModalProps {
  open: boolean;
  onClose: () => void;
}

function extractErrorMessage(err: unknown, fallback: string) {
  const rawMessage = err instanceof Error ? err.message : "";

  try {
    const parsed = JSON.parse(rawMessage) as { message?: string | string[] };
    if (Array.isArray(parsed.message)) return parsed.message.join(" ");
    if (typeof parsed.message === "string") return parsed.message;
  } catch {
    // rawMessage não era JSON, cai no fallback abaixo.
  }

  return fallback;
}

export function DeleteAccountModal({ open, onClose }: DeleteAccountModalProps) {
  const { user, deleteAccount } = useAuth();
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setPassword("");
    setError(null);
    setIsSubmitting(false);
  }, [open]);

  if (!open) {
    return null;
  }

  const handleConfirm = async () => {
    if (password.length < 6) {
      setError("Digite sua senha para confirmar.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await deleteAccount(password);
      onClose();
    } catch (err) {
      setError(
        extractErrorMessage(
          err,
          "Não foi possível excluir sua conta agora. Tente novamente em instantes.",
        ),
      );
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

      <div className="mx-auto flex min-h-full max-w-md items-center py-8">
        <div
          className="relative w-full rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-default)",
          }}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              style={{
                backgroundColor: "var(--status-danger-bg)",
                color: "var(--status-danger-text)",
              }}
            >
              <AlertTriangle size={22} />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full transition"
              style={{ color: "var(--text-secondary)" }}
            >
              <X size={18} />
            </button>
          </div>

          <h2
            className="text-xl font-extrabold"
            style={{ color: "var(--text-primary)" }}
          >
            Excluir sua conta
          </h2>
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Essa ação é permanente e não pode ser desfeita. Ao confirmar,{" "}
            {user?.name?.split(" ")[0] || "sua conta"} e todos os dados
            associados serão apagados, incluindo{" "}
            {user?.role === "ONG"
              ? "todos os pets cadastrados por você"
              : "seus pets cadastrados e solicitações de adoção"}
            .
          </p>

          <div className="mt-5">
            <label
              htmlFor="delete-account-password"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              Confirme sua senha
            </label>
            <input
              id="delete-account-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Sua senha"
              className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition focus:ring-2"
              style={{
                borderColor: "var(--border-default)",
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          {error && (
            <div
              className="mt-3 rounded-xl border p-3 text-sm"
              style={{
                backgroundColor: "var(--status-danger-bg)",
                borderColor: "var(--status-danger-border)",
                color: "var(--status-danger-text)",
              }}
            >
              {error}
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-4 py-2.5 text-sm font-semibold transition"
              style={{
                borderColor: "var(--border-default)",
                color: "var(--text-secondary)",
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: "var(--status-danger-text)" }}
            >
              {isSubmitting ? "Excluindo..." : "Excluir conta definitivamente"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
