"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { STATUS_COLORS } from "@/constants/theme";
import { PasswordInput } from "../register/components/PasswordInput";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError("Link inválido. Solicite uma nova redefinição de senha.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      setIsSuccess(true);
    } catch (err) {
      const rawMessage = err instanceof Error ? err.message : "";
      try {
        const parsed = JSON.parse(rawMessage) as { message?: string };
        setError(
          parsed.message ||
            "Não foi possível redefinir a senha. O link pode ter expirado.",
        );
      } catch {
        setError(
          "Não foi possível redefinir a senha. O link pode ter expirado.",
        );
      }
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
          Redefinir senha
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Escolha uma nova senha para sua conta no ConectaPet.
        </p>

        {isSuccess ? (
          <div className="mt-6 space-y-4">
            <p
              className="rounded-xl px-4 py-3 text-sm"
              style={{
                backgroundColor: STATUS_COLORS.success[100],
                color: STATUS_COLORS.success[700],
              }}
            >
              Senha redefinida com sucesso. Agora você já pode entrar com a
              nova senha.
            </p>
            <Link
              href="/login"
              className="block w-full rounded-xl bg-brand-600 px-4 py-2 text-center font-semibold text-white"
            >
              Ir para o login
            </Link>
          </div>
        ) : !token ? (
          <p
            className="mt-6 rounded-xl px-4 py-3 text-sm"
            style={{
              backgroundColor: STATUS_COLORS.danger[100],
              color: STATUS_COLORS.danger[700],
            }}
          >
            Link inválido ou incompleto. Solicite uma nova redefinição em{" "}
            <Link href="/forgot-password" className="underline">
              Esqueceu a senha?
            </Link>
          </p>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <PasswordInput
              value={password}
              onChange={setPassword}
              showPassword={showPassword}
              onToggleShowPassword={() => setShowPassword((prev) => !prev)}
            />

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium"
              >
                Confirme a nova senha
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
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
              {isSubmitting ? "Redefinindo..." : "Redefinir senha"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
