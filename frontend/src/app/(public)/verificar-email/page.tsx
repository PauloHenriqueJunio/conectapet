"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { STATUS_COLORS } from "@/constants/theme";

type VerificationState = "loading" | "success" | "error";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [state, setState] = useState<VerificationState>(
    token ? "loading" : "error",
  );
  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    let isMounted = true;

    apiFetch("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
      .then(() => {
        if (isMounted) setState("success");
      })
      .catch(() => {
        if (isMounted) setState("error");
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleResend = async () => {
    if (!resendEmail) {
      return;
    }

    setIsResending(true);
    setResendMessage(null);

    try {
      await apiFetch("/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email: resendEmail }),
      });
      setResendMessage(
        "Se o e-mail existir e ainda não tiver sido confirmado, enviamos um novo link.",
      );
    } catch {
      setResendMessage("Não foi possível reenviar agora. Tente novamente.");
    } finally {
      setIsResending(false);
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
          Confirmação de e-mail
        </h1>

        {state === "loading" && (
          <p className="mt-6 text-sm text-slate-600">
            Confirmando seu e-mail...
          </p>
        )}

        {state === "success" && (
          <div className="mt-6 space-y-4">
            <p
              className="rounded-xl px-4 py-3 text-sm"
              style={{
                backgroundColor: STATUS_COLORS.success[100],
                color: STATUS_COLORS.success[700],
              }}
            >
              E-mail confirmado com sucesso! Agora você já pode entrar na
              sua conta.
            </p>
            <Link
              href="/login"
              className="block w-full rounded-xl bg-brand-600 px-4 py-2 text-center font-semibold text-white"
            >
              Ir para o login
            </Link>
          </div>
        )}

        {state === "error" && (
          <div className="mt-6 space-y-4">
            <p
              className="rounded-xl px-4 py-3 text-sm"
              style={{
                backgroundColor: STATUS_COLORS.danger[100],
                color: STATUS_COLORS.danger[700],
              }}
            >
              Não foi possível confirmar seu e-mail. O link pode ter
              expirado ou já ter sido usado. Informe seu e-mail abaixo para
              receber um novo link.
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                placeholder="seu@email.com"
                value={resendEmail}
                onChange={(event) => setResendEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none ring-brand-300 focus:ring"
              />
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending || !resendEmail}
                className="shrink-0 rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isResending ? "Enviando..." : "Reenviar"}
              </button>
            </div>

            {resendMessage && (
              <p className="text-sm text-slate-600">{resendMessage}</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
