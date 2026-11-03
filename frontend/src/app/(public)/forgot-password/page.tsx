"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { STATUS_COLORS } from "@/constants/theme";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setIsSubmitted(true);
    } catch {
      setError("Não foi possível enviar o e-mail agora. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-12">
      <div className="w-full rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-slate-100">
        <Link
          href="/login"
          className="mb-6 flex w-fit items-center text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o login
        </Link>

        <h1 className="text-3xl font-bold text-slate-900">
          Esqueceu a senha?
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Informe seu e-mail e enviaremos um link para redefinir sua senha.
        </p>

        {isSubmitted ? (
          <p
            className="mt-6 rounded-xl px-4 py-3 text-sm"
            style={{
              backgroundColor: STATUS_COLORS.success[100],
              color: STATUS_COLORS.success[700],
            }}
          >
            Se o e-mail informado existir em nossa base, você receberá um
            link para redefinir a senha em poucos minutos.
          </p>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none ring-brand-300 focus:ring"
              />
            </div>

            {error && (
              <p
                className="rounded-xl px-3 py-2 text-sm"
                style={{
                  backgroundColor: STATUS_COLORS.danger[100],
                  color: STATUS_COLORS.danger[700],
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Enviando..." : "Enviar link de redefinição"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
