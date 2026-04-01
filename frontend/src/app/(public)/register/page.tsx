"use client";

import Link from "next/link";
import { FormEvent, useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/api";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { maskCEP, maskCPF, maskCNPJ, maskPhone } from "@/utils/masks";

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
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  // --- LÓGICA BRASIL API (BUSCA CEP) ---
  useEffect(() => {
    const fetchAddress = async () => {
      const cleanCep = cep.replace(/\D/g, "");
      if (cleanCep.length === 8) {
        setIsLoadingCep(true);
        try {
          const response = await fetch(
            `https://brasilapi.com.br/api/cep/v1/${cleanCep}`,
          );
          if (response.ok) {
            const data = await response.json();
            // Formata o endereço bonitinho: Logradouro, Bairro - Cidade/UF
            const formattedAddress = `${data.street}, ${data.neighborhood} - ${data.city}/${data.state}`;
            setAddress(formattedAddress);
            setError(null);
          }
        } catch (err) {
          console.error("Erro ao buscar CEP", err);
        } finally {
          setIsLoadingCep(false);
        }
      }
    };

    fetchAddress();
  }, [cep]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validações básicas antes de enviar
    if (role === "ONG" && !cnpj) {
      setError("CNPJ é obrigatório para ONG.");
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
        contact: contact || undefined,
        address: address || undefined,
        cpf: cpf || undefined,
        cnpj: cnpj || undefined,
      });
    } catch (err: any) {
      setError("Falha ao cadastrar. Verifique os dados.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-6 py-12">
      <div className="w-full rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-slate-100">
        <Link
          href="/login"
          className="mb-6 flex w-fit items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
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
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${role === "PESSOA_FISICA" ? "bg-white text-brand-700 shadow-sm" : "text-slate-600 hover:text-slate-800"}`}
          >
            Pessoa Física
          </button>
          <button
            type="button"
            onClick={() => {
              setRole("ONG");
              setCpf("");
            }}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${role === "ONG" ? "bg-white text-brand-700 shadow-sm" : "text-slate-600 hover:text-slate-800"}`}
          >
            ONG
          </button>
        </nav>

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
              onChange={(e) => setName(e.target.value)}
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
                onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 py-2 pl-4 pr-10 outline-none ring-brand-300 focus:ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cep" className="mb-1 block text-sm font-medium">
                CEP{" "}
                {isLoadingCep && (
                  <span className="text-xs text-brand-500 animate-pulse">
                    (Buscando...)
                  </span>
                )}
              </label>
              <input
                id="cep"
                type="text"
                required
                value={cep}
                onChange={(e) => setCep(maskCEP(e.target.value))}
                placeholder="00000-000"
                className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none ring-brand-300 focus:ring"
              />
            </div>

            <div>
              {role === "PESSOA_FISICA" ? (
                <>
                  <label
                    htmlFor="cpf"
                    className="mb-1 block text-sm font-medium"
                  >
                    CPF (opcional)
                  </label>
                  <input
                    id="cpf"
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(maskCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none ring-brand-300 focus:ring"
                  />
                </>
              ) : (
                <>
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
                    onChange={(e) => setCnpj(maskCNPJ(e.target.value))}
                    placeholder="00.000.000/0000-00"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none ring-brand-300 focus:ring"
                  />
                </>
              )}
            </div>
          </div>

          {role === "ONG" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contact"
                  className="mb-1 block text-sm font-medium"
                >
                  Contato
                </label>
                <input
                  id="contact"
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(maskPhone(e.target.value))}
                  placeholder="(00) 00000-0000"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2 outline-none ring-brand-300 focus:ring"
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="mb-1 block text-sm font-medium"
                >
                  Endereço
                </label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 outline-none ring-brand-300 focus:ring"
                />
              </div>
            </div>
          )}

          {role === "PESSOA_FISICA" && (
            <div>
              <label
                htmlFor="address"
                className="mb-1 block text-sm font-medium"
              >
                Endereço
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 outline-none ring-brand-300 focus:ring"
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
            className="w-full rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70 transition-all active:scale-[0.98]"
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
          onClick={() => alert("Google Login em breve!")}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="h-5 w-5"
          />
          Google
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          Já tem conta?{" "}
          <Link
            href="/login"
            className="font-semibold text-brand-700 hover:underline"
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
          Carregando...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
