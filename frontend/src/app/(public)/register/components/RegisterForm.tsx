"use client";

import Link from "next/link";
import { FormEvent, useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Role } from "@/types/api";
import { maskCEP, maskCNPJ, maskCPF, maskPhone } from "@/utils/masks";
import { DocumentInput } from "./DocumentInput";
import { PasswordInput } from "./PasswordInput";
import { RoleSelector } from "./RoleSelector";
import { useCepLookup } from "../hooks/useCepLookup";
import { STATUS_COLORS } from "@/constants/theme";

export function RegisterForm() {
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

  const handleAddressResolved = useCallback((resolvedAddress: string) => {
    setAddress(resolvedAddress);
  }, []);

  const handleClearError = useCallback(() => {
    setError(null);
  }, []);

  const { isLoadingCep } = useCepLookup({
    cep,
    onAddressResolved: handleAddressResolved,
    onErrorClear: handleClearError,
  });

  const handleRoleChange = (nextRole: Role) => {
    setRole(nextRole);

    if (nextRole === "PESSOA_FISICA") {
      setCnpj("");
      return;
    }

    setCpf("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

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
    } catch (err) {
      const rawMessage = err instanceof Error ? err.message : "";
      try {
        const parsed = JSON.parse(rawMessage) as {
          message?: string | string[];
        };
        const backendMessage = Array.isArray(parsed.message)
          ? parsed.message[0]
          : parsed.message;
        setError(backendMessage || "Falha ao cadastrar. Verifique os dados.");
      } catch {
        setError(rawMessage || "Falha ao cadastrar. Verifique os dados.");
      }
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

        <RoleSelector role={role} onRoleChange={handleRoleChange} />

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

            <PasswordInput
              value={password}
              onChange={setPassword}
              showPassword={showPassword}
              onToggleShowPassword={() => setShowPassword((prev) => !prev)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cep" className="mb-1 block text-sm font-medium">
                CEP{" "}
                {isLoadingCep && (
                  <span className="animate-pulse text-xs text-brand-500">
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
              <DocumentInput
                role={role}
                cpf={cpf}
                cnpj={cnpj}
                onCpfChange={(value) => setCpf(maskCPF(value))}
                onCnpjChange={(value) => setCnpj(maskCNPJ(value))}
              />
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
            className="w-full rounded-xl bg-brand-600 px-4 py-2 font-semibold text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
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
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
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
