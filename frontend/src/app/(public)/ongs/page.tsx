"use client";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import { Phone, MapPin, Building2 } from "lucide-react";
import { STATUS_COLORS } from "@/constants/theme";

interface ONG {
  id: string;
  name: string;
  state: string | null;
  city: string | null;
  contact: string | null;
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

      <section className="relative overflow-hidden bg-brand-600 px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-10"></div>

        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            ConheÃ§a nossas ONGs parceiras
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-medium text-brand-100">
            OrganizaÃ§Ãµes comprometidas com o resgate, cuidado e adoÃ§Ã£o
            responsÃ¡vel de pets. Escolha uma parceira e comece sua jornada.
          </p>
        </div>
      </section>

      <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
          </div>
        )}

        {error && (
          <div className="py-10 text-center">
            <p style={{ color: STATUS_COLORS.danger[700] }}>Erro: {error}</p>
          </div>
        )}

        {!loading && !error && ongs.length === 0 && (
          <div className="py-20 text-center">
            <Building2 size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-lg text-slate-600">Nenhuma ONG cadastrada ainda.</p>
          </div>
        )}

        {!loading && !error && ongs.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="mb-2 text-3xl font-bold text-slate-900">
                ONGs Cadastradas
              </h2>
              <p className="text-slate-500">
                Total de {ongs.length} organizaÃ§Ã£o{ongs.length !== 1 ? "s" : ""}{" "}
                disponÃ­vel{ongs.length !== 1 ? "s" : ""}
              </p>
            </div>

            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ongs.map((ong) => (
                <a
                  key={ong.id}
                  href={`/ongs/${ong.id}`}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:ring-brand-200 no-underline"
                >
                  <article className="flex h-full flex-col">
                    <div className="flex h-32 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-brand-400 to-brand-600">
                      <Building2 size={56} className="text-white/80" />
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="mb-4 line-clamp-2 text-2xl font-extrabold text-slate-900 transition-colors group-hover:text-brand-600">
                        {ong.name}
                      </h3>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin
                            size={18}
                            className="mt-0.5 flex-shrink-0 text-brand-600"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                              LocalizaÃ§Ã£o
                            </p>
                            <p className="text-sm font-semibold text-slate-800">
                              {ong.state && ong.city
                                ? `${ong.city}, ${ong.state}`
                                : "NÃ£o informado"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Phone
                            size={18}
                            className="mt-0.5 flex-shrink-0 text-brand-600"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                              Contato
                            </p>
                            <p className="text-sm font-semibold text-slate-800">
                              {ong.contact ?? "NÃ£o informado"}
                            </p>
                          </div>
                        </div>
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
