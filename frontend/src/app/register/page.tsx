"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/api";

export default function RegisterPage() {
  const { register } = useAuth();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "ONG" ? "ONG" : "ADOTANTE";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(initialRole);
  const [cpf, setCpf] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (role === "ONG" && cnpj.trim().length === 0) {
      setError("CNPJ é obrigatório para cadastro de ONG.");
      setIsSubmitting(false);
      return;
    }

    try {
      await register({
        name,
        email,
        password,
        role,
        cpf: cpf.trim() || undefined,
        cnpj: cnpj.trim() || undefined,
      });
    } catch {
      setError("Não foi possível concluir o cadastro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-12">
      <div className="w-full rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-slate-100">
        <h1 className="text-3xl font-bold text-slate-900">Criar conta</h1>
        <p className="mt-2 text-sm text-slate-600">
          Cadastre-se como ONG ou pessoa física.
        </p>

        <nav className="mt-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setRole("ADOTANTE");
              setCnpj("");
            }}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              role === "ADOTANTE"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            Pessoa Física
          </button>
          <button
            type="button"
            onClick={() => {
              setRole("ONG");
              setCpf("");
            }}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              role === "ONG"
                ? "bg-white text-brand-700 shadow-sm"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            ONG
          </button>
        </nav>

        <p className="mt-3 text-xs text-slate-500">
          {role === "ONG"
            ? "Para ONG, o CNPJ e obrigatorio."
            : "Para pessoa fisica, o CPF e opcional."}
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium">Nome</label>
            <input
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none ring-brand-300 focus:ring"
            />
          </div>

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

          {role === "ADOTANTE" && (
            <div>
              <label className="mb-1 block text-sm font-medium">
                CPF (opcional)
              </label>
              <input
                type="text"
                value={cpf}
                onChange={(event) => setCpf(event.target.value)}
                placeholder="Ex: 123.456.789-00"
                className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none ring-brand-300 focus:ring"
              />
            </div>
          )}

          {role === "ONG" && (
            <div>
              <label className="mb-1 block text-sm font-medium">
                CNPJ (obrigatório)
              </label>
              <input
                type="text"
                required
                value={cnpj}
                onChange={(event) => setCnpj(event.target.value)}
                placeholder="Ex: 12.345.678/0001-90"
                className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none ring-brand-300 focus:ring"
              />
            </div>
          )}

          {error && (
            <p className="rounded-xl bg-red-100 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white disabled:opacity-70"
          >
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Já tem conta?{" "}
          <Link href="/login" className="font-semibold text-brand-700">
            Fazer login
          </Link>
        </p>
      </div>
    </main>
  );
}
