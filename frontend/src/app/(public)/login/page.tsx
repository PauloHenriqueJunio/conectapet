"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/api";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { STATUS_COLORS } from "@/constants/theme";

export default function LoginPage() {
  const { login } = useAuth();
  const [userType, setUserType] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!userType) {
      setError("Selecione se vai entrar como Pessoa Física ou ONG.");
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ email, password }, userType);
    } catch (err) {
      if (err instanceof Error && err.message === "ROLE_MISMATCH") {
        if (userType === "PESSOA_FISICA") {
          setError(
            "Este e-mail pertence a uma ONG. Para entrar, selecione a aba ONG.",
          );
        } else {
          setError(
            "Este e-mail pertence a Pessoa Física. Para entrar, selecione a aba Pessoa Física.",
          );
        }
      } else {
        setError("Falha no login. Verifique suas credenciais.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-12">
      <div className="w-full rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-slate-100">
        <Link
          href="/"
          className="mb-6 flex w-fit items-center text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>

        <h1 className="text-3xl font-bold text-slate-900">
          Entrar no ConectaPet
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Acesse sua conta para gerenciar adoções.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Selecione primeiro o tipo da conta para entrar.
        </p>

        <nav className="mt-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setUserType("PESSOA_FISICA")}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              userType === "PESSOA_FISICA"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            Pessoa Física
          </button>
          <button
            type="button"
            onClick={() => setUserType("ONG")}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              userType === "ONG"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            ONG
          </button>
        </nav>

        <p className="mt-3 text-xs text-slate-500">
          {userType === "ONG"
            ? "Se você for ONG, o cadastro deve incluir CNPJ."
            : userType === "PESSOA_FISICA"
              ? "Se você for pessoa física, o CPF no cadastro é opcional."
              : "Escolha uma aba para continuar."}
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
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

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium">
                Senha
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-brand-600 underline-offset-2 hover:text-brand-800 hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2 pl-4 pr-10 outline-none ring-brand-300 focus:ring"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
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
            disabled={isSubmitting || !userType}
            className="w-full rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-6 flex items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="mx-4 text-xs text-slate-400">ou continue com</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <button
          type="button"
          onClick={() => alert("Autenticação com Google em breve!")}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Logo do Google"
            className="h-5 w-5"
          />
          Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          Ainda não tem conta?{" "}
          <Link
            href={userType ? `/register?role=${userType}` : "/register"}
            className="font-semibold text-brand-700 underline-offset-2 hover:underline"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}
