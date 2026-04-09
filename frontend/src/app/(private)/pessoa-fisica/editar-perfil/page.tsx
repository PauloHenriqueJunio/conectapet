"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Mail, Phone, MapPin, Building2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditarPerfilPFPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    contact: "",
    address: "",
    cep: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      setFormData({
        email: user.email || "",
        contact: user.contact || "",
        address: user.address || "",
        cep: user.cep || "",
      });
    }
  }, [user, isLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      if (!token) throw new Error("Não autenticado");

      const updateData: any = {};
      if (formData.email !== user?.email) updateData.email = formData.email;
      if (formData.contact !== user?.contact) updateData.contact = formData.contact;
      if (formData.address !== user?.address) updateData.address = formData.address;
      if (formData.cep !== user?.cep) updateData.cep = formData.cep;

      if (Object.keys(updateData).length === 0) {
        setError("Nenhuma alteração foi feita.");
        setLoading(false);
        return;
      }

      await apiFetch("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify(updateData),
      }, token);

      setSuccess(true);
      setTimeout(() => {
        router.push("/pessoa-fisica/home");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <SiteHeader page="dashboard-home" variant="pessoa-fisica" />
        <main className="flex-1 flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader page="dashboard-home" variant="pessoa-fisica" />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/pessoa-fisica/home"
            className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium mb-4"
          >
            <ArrowLeft size={18} />
            Voltar
          </Link>
          <h1 className="text-4xl font-extrabold text-slate-900">Editar Perfil</h1>
          <p className="text-slate-600 mt-2">
            Atualize seus dados de contato e endereço
          </p>
        </div>

        <div className="max-w-2xl">
          {error && (
            <div className="mb-6 rounded-2xl bg-red-50 p-4 border border-red-100 text-red-600 text-center font-medium animate-in fade-in duration-300">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-2xl bg-green-50 p-4 border border-green-100 text-green-600 text-center font-medium animate-in fade-in duration-300">
              Perfil atualizado com sucesso! Redirecionando...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100 space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-900 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring focus:ring-brand-200 outline-none transition"
                  />
                </div>
              </div>

              {/* Telefone */}
              <div>
                <label htmlFor="contact" className="block text-sm font-bold text-slate-900 mb-2">
                  Telefone
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="tel"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="(00) 9999-9999"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring focus:ring-brand-200 outline-none transition"
                  />
                </div>
              </div>

              {/* CEP */}
              <div>
                <label htmlFor="cep" className="block text-sm font-bold text-slate-900 mb-2">
                  CEP
                </label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    id="cep"
                    name="cep"
                    value={formData.cep}
                    onChange={handleChange}
                    placeholder="00000-000"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring focus:ring-brand-200 outline-none transition"
                  />
                </div>
              </div>

              {/* Endereço */}
              <div>
                <label htmlFor="address" className="block text-sm font-bold text-slate-900 mb-2">
                  Endereço
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Rua, número, complemento"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring focus:ring-brand-200 outline-none transition"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-brand-600 px-6 py-3 font-bold text-white hover:bg-brand-700 disabled:bg-slate-300 transition"
              >
                {loading ? "Salvando..." : "Salvar Alterações"}
              </button>
              <Link
                href="/pessoa-fisica/home"
                className="flex-1 rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700 hover:bg-slate-50 transition text-center"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
