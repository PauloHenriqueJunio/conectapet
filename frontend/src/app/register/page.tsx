"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/api";

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("ADOTANTE");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await register({ name, email, password, role });
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
          Cadastre-se como ONG ou adotante.
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

          <div>
            <label className="mb-1 block text-sm font-medium">Perfil</label>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as Role)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none ring-brand-300 focus:ring"
            >
              <option value="ADOTANTE">Adotante</option>
              <option value="ONG">ONG</option>
            </select>
          </div>

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
