"use client";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import { Mail, ShieldCheck, Phone, MapPin, Building2 } from "lucide-react";

interface ONG {
  id: string;
  name: string;
  email: string;
  cep: string | null;
  state: string | null;
  city: string | null;
  cnpj: string | null;
  contact: string | null;
  address: string | null;
}

function formatCnpj(cnpj: string | null) {
  if (!cnpj) return "CNPJ não informado";
  const digits = cnpj.replace(/\D/g, "");
  if (digits.length !== 14) return cnpj;

  return digits.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    "$1.$2.$3/$4-$5",
  );
}

export default function OngsPage() {
  const [ongs, setOngs] = useState<ONG[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOngs = async () => {
      try {
        const data = await apiFetch<ONG[]>("/auth/ongs");
        setOngs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchOngs();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader page="ongs" variant="public" />

      <section className="relative bg-brand-600 px-4 py-16 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-4">
            Conheça nossas ONGs parceiras
          </h1>
          <p className="text-lg text-brand-100 max-w-2xl mx-auto font-medium">
            Organizações comprometidas com o resgate, cuidado e adoção
            responsável de pets. Escolha uma parceira e comece sua jornada.
          </p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-1">
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
          </div>
        )}

        {error && (
          <div className="mb-8 rounded-2xl bg-red-50 p-4 border border-red-100 text-red-600 text-center font-medium">
            Erro ao carregar ONGs: {error}
          </div>
        )}

        {!loading && !error && ongs.length === 0 && (
          <div className="py-20 text-center">
            <Building2 size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-slate-600 text-lg">
              Nenhuma ONG cadastrada ainda.
            </p>
          </div>
        )}

        {!loading && !error && ongs.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                ONGs Cadastradas
              </h2>
              <p className="text-slate-500">
                Total de {ongs.length} organização{ongs.length !== 1 ? "s" : ""}{" "}
                disponível{ongs.length !== 1 ? "s" : ""}
              </p>
            </div>

            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ongs.map((ong) => (
                <a
                  key={ong.id}
                  href={`/ongs/${ong.id}`}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:ring-brand-200 no-underline"
                >
                  <article className="flex flex-col h-full">
                    <div className="flex h-32 w-full items-center justify-center bg-gradient-to-br from-brand-400 to-brand-600 overflow-hidden">
                      <Building2 size={56} className="text-white/80" />
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-2xl font-extrabold text-slate-900 mb-4 group-hover:text-brand-600 transition-colors line-clamp-2">
                        {ong.name}
                      </h3>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <ShieldCheck
                            size={18}
                            className="text-brand-600 mt-0.5 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                              CNPJ
                            </p>
                            <p className="text-sm font-semibold text-slate-800 break-all">
                              {formatCnpj(ong.cnpj)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin
                            size={18}
                            className="text-brand-600 mt-0.5 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                              Localização
                            </p>
                            <p className="text-sm font-semibold text-slate-800">
                              {ong.state && ong.city
                                ? `${ong.city}, ${ong.state}`
                                : "Não informado"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Phone
                            size={18}
                            className="text-brand-600 mt-0.5 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                              Contato
                            </p>
                            <p className="text-sm font-semibold text-slate-800">
                              {ong.contact ?? "Não informado"}
                            </p>
                          </div>
                        </div>

                        {ong.email && (
                          <div className="flex items-start gap-3">
                            <Mail
                              size={18}
                              className="text-brand-600 mt-0.5 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                                Email
                              </p>
                              <a
                                href={`mailto:${ong.email}`}
                                className="text-sm font-semibold text-brand-600 hover:text-brand-700 hover:underline break-all"
                              >
                                {ong.email}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                </a>
              ))}
            </section>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
