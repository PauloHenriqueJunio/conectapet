"use client";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useEffect, useState } from "react";

interface ONG {
  id: string;
  name: string;
  email: string;
  cnpj: string | null;
}

export default function OngsPage() {
  const [ongs, setOngs] = useState<ONG[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOngs = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/ongs`,
        );
        if (!response.ok) {
          throw new Error("Falha ao buscar ONGs");
        }
        const data = await response.json();
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
    <main className="mx-auto max-w-6xl px-6 py-10">
      <SiteHeader page="ongs" />

      <section className="mb-6 rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-100 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Verifique as ONGs</h1>
        <p className="mt-2 text-sm text-slate-600">
          Encontre organizaçôes parceiras e escolha com quem iniciar o processo
          de adoção.
        </p>
      </section>

      {loading && (
        <div className="text-center py-10">
          <p className="text-slate-600">Carregando ONGs...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-10">
          <p className="text-red-600">Erro: {error}</p>
        </div>
      )}

      {!loading && !error && ongs.length === 0 && (
        <div className="text-center py-10">
          <p className="text-slate-600">Nenhuma ONG cadastrada ainda.</p>
        </div>
      )}

      {!loading && !error && ongs.length > 0 && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ongs.map((ong) => (
            <article
              key={ong.id}
              className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-slate-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-start gap-2">
                <h2 className="text-xl font-bold text-slate-800 flex-1">
                  {ong.name}
                </h2>
                {ong.cnpj && (
                  <span className="text-xs bg-brand-50 text-brand-700 px-2 py-1 rounded whitespace-nowrap font-mono">
                    {ong.cnpj}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm font-medium text-brand-700">
                {ong.email}
              </p>
            </article>
          ))}
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
