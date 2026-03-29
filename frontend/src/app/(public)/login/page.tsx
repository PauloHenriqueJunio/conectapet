"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/api";

export default function LoginPage() {
  const { login } = useAuth();
  const [userType, setUserType] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        <h1 className="text-3xl font-bold text-slate-900">
          Entrar no NOME_DO_PROJETO{" "}
          {/* Lembrete: Trocar aqui se mudar o nome! */}
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
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none ring-brand-300 focus:ring"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Senha</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none ring-brand-300 focus:ring"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-100 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !userType}
            className="w-full rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white disabled:opacity-70"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Ainda não tem conta?{" "}
          <Link
            href={userType ? `/register?role=${userType}` : "/register"}
            className={`font-semibold underline-offset-2 ${
              userType
                ? "text-brand-700 hover:underline"
                : "pointer-events-none text-slate-400"
            }`}
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}
