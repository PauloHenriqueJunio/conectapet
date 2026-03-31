"use client";

import Link from "next/link";
import { FormEvent, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/api";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

function getRegisterErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return "Não foi possível concluir o cadastro.";
  }

  const rawMessage = error.message?.trim();
  if (!rawMessage) {
    return "Não foi possível concluir o cadastro.";
  }

  try {
    const parsed = JSON.parse(rawMessage) as {
      message?: string | string[];
    };

    if (Array.isArray(parsed.message)) {
      return parsed.message.join(" ");
    }

    if (typeof parsed.message === "string" && parsed.message.length > 0) {
      return parsed.message;
    }
  } catch {
    return rawMessage;
  }

  return rawMessage;
}

function RegisterForm() {
  const { register } = useAuth();
  const searchParams = useSearchParams();
  const initialRole =
    searchParams.get("role") === "ONG" ? "ONG" : "PESSOA_FISICA";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cep, setCep] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState<Role>(initialRole);
  const [cpf, setCpf] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (role === "ONG" && cnpj.trim().length === 0) {
      setError("CNPJ é obrigatório para cadastro de ONG.");
      setIsSubmitting(false);
      return;
    }

    if (cep.trim().length === 0) {
      setError("CEP é obrigatório.");
      setIsSubmitting(false);
      return;
    }

    if (role === "ONG" && contact.trim().length === 0) {
      setError("Contato é obrigatório para cadastro de ONG.");
      setIsSubmitting(false);
      return;
    }

    try {
      await register({
        name,
        email,
        password,
        role,
        cep,
        contact: contact.trim() || undefined,
        address: address.trim() || undefined,
        cpf: cpf.trim() || undefined,
        cnpj: cnpj.trim() || undefined,
      });
    } catch (err) {
      setError(getRegisterErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-6 py-12">
      <div className="w-full rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-slate-100">
        <Link
          href="/login"
          className="mb-6 flex w-fit items-center text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>

        <h1 className="text-3xl font-bold text-slate-900">Criar conta</h1>
        <p className="mt-2 text-sm text-slate-600">
          Cadastre-se como ONG ou pessoa física.
        </p>

        <nav className="mt-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setRole("PESSOA_FISICA");
              setCnpj("");
            }}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              role === "PESSOA_FISICA"
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
            ? "Para ONG, o CNPJ é obrigatório."
            : "Para pessoa física, o CPF é opcional."}
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Nome
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none ring-brand-300 focus:ring"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium"
              >
                Senha
              </label>
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
          </div>

          {role === "PESSOA_FISICA" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="cep" className="mb-1 block text-sm font-medium">
                  CEP (obrigatório)
                </label>
                <input
                  id="cep"
                  type="text"
                  required
                  value={cep}
                  onChange={(event) => setCep(event.target.value)}
                  placeholder="Ex: 01001-000"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none ring-brand-300 focus:ring"
                />
              </div>

              <div>
                <label htmlFor="cpf" className="mb-1 block text-sm font-medium">
                  CPF (opcional)
                </label>
                <input
                  id="cpf"
                  type="text"
                  value={cpf}
                  onChange={(event) => setCpf(event.target.value)}
                  placeholder="Ex: 123.456.789-00"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none ring-brand-300 focus:ring"
                />
              </div>
            </div>
          )}

          {role === "ONG" && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="cnpj"
                    className="mb-1 block text-sm font-medium"
                  >
                    CNPJ (obrigatório)
                  </label>
                  <input
                    id="cnpj"
                    type="text"
                    required
                    value={cnpj}
                    onChange={(event) => setCnpj(event.target.value)}
                    placeholder="Ex: 12.345.678/0001-90"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none ring-brand-300 focus:ring"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact"
                    className="mb-1 block text-sm font-medium"
                  >
                    Contato (obrigatório)
                  </label>
                  <input
                    id="contact"
                    type="text"
                    required
                    value={contact}
                    onChange={(event) => setContact(event.target.value)}
                    placeholder="Ex: (11) 99999-0000"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none ring-brand-300 focus:ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="cep"
                    className="mb-1 block text-sm font-medium"
                  >
                    CEP (obrigatório)
                  </label>
                  <input
                    id="cep"
                    type="text"
                    required
                    value={cep}
                    onChange={(event) => setCep(event.target.value)}
                    placeholder="Ex: 01001-000"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none ring-brand-300 focus:ring"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="mb-1 block text-sm font-medium"
                  >
                    Endereço (opcional)
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Ex: Rua das Flores, 123"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none ring-brand-300 focus:ring"
                  />
                </div>
              </div>
            </>
          )}

          {error && (
            <p className="rounded-xl bg-red-100 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
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
          Já tem conta?{" "}
          <Link
            href="/login"
            className="font-semibold text-brand-700 underline-offset-2 hover:underline"
          >
            Fazer login
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-slate-500">Carregando...</p>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
