"use client";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { useEffect, useState } from "react";
import { Mail, ShieldCheck, Phone, MapPin } from "lucide-react";

interface ONG {
  id: string;
  name: string;
  email: string;
  cep: string | null;
  cnpj: string | null;
  contact: string | null;
  address: string | null;
}

interface BrasilApiCep {
  state: string;
  city: string;
}

function formatCnpj(cnpj: string | null) {
  if (!cnpj) return "CNPJ nao informado";

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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/ongs`,
        );
        if (!response.ok) {
          throw new Error("Falha ao buscar ONGs");
        }
        const data = (await response.json()) as ONG[];

        const enrichedOngs = await Promise.all(
          data.map(async (ong) => {
            if (ong.address || !ong.cep) {
              return ong;
            }

            try {
              const cepResponse = await fetch(
                `https://brasilapi.com.br/api/cep/v1/${ong.cep.replace(/\D/g, "")}`,
              );

              if (!cepResponse.ok) {
                return ong;
              }

              const cepData = (await cepResponse.json()) as BrasilApiCep;
              const stateCity = `${cepData.state} - ${cepData.city}`;

              return {
                ...ong,
                address: stateCity,
              };
            } catch {
              return ong;
            }
          }),
        );

        setOngs(enrichedOngs);
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
        <h1 className="text-3xl font-bold text-slate-900">
          Verifique as ONGS cadastradas
        </h1>
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
              <div className="flex flex-col justify-between items-start gap-2">
                <h2 className="text-2xl font-bold text-slate-800 flex-1">
                  {ong.name}
                </h2>
                <p className="text-base text-brand-700 font-medium flex items-center gap-1">
                  <ShieldCheck size={19} />
                  <span className="text-neutral-800 font-semibold">
                    : {formatCnpj(ong.cnpj)}
                  </span>
                </p>
                <p className="text-base font-medium text-brand-700 flex items-center gap-1">
                  <Mail size={19} />
                  <a
                    className="text-emerald-600 hover:text-emerald-700 font-medium underline-offset-2 hover:underline"
                    href={`mailto:${ong.email}`}
                  >
                    <span className="text-neutral-800 font-semibold">:</span>{" "}
                    {ong.email}
                  </a>
                </p>
                <p className="text-base font-medium text-brand-700 flex items-center gap-1">
                  <Phone size={19} />
                  <span className="text-neutral-800 font-semibold">
                    : {ong.contact ?? "Nao informado"}
                  </span>
                </p>

                <p className="text-base font-medium text-brand-700 flex items-center gap-1">
                  <MapPin size={19} />
                  <span className="text-neutral-800 font-semibold">
                    : {ong.address ?? "Nao informado"}
                  </span>
                </p>
              </div>
            </article>
          ))}
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
