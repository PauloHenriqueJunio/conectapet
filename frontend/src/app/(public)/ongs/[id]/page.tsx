"use client";

import { use, useEffect, useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { apiFetch } from "@/lib/api";
import {
  Phone,
  MapPin,
  Building2,
  Heart,
  Share2,
  PawPrint,
  Users,
  Gift,
} from "lucide-react";
import Link from "next/link";

interface ONG {
  id: string;
  name: string;
  email?: string;
  contact: string | null;
  cep?: string;
  state: string | null;
  city: string | null;
  address?: string | null;
}

interface Pet {
  id: string;
  name: string;
  species: string;
  age: number;
  photoUrl: string;
  isAdopted: boolean;
}

interface OngDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function OngDetailsPage({ params }: OngDetailsPageProps) {
  const [ong, setOng] = useState<ONG | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const { id } = use(params);

  useEffect(() => {
    const fetchOngData = async () => {
      try {
        const ongs = await apiFetch<ONG[]>("/auth/ongs");
        const ongData = ongs.find((item) => item.id === id) ?? null;

        setOng(ongData);

        const petsData = await apiFetch<Pet[]>(`/pets/ong/${id}/available`);
        setPets(petsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar ONG");
      } finally {
        setLoading(false);
      }
    };

    fetchOngData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader page="ongs" variant="public" />
        <main className="flex flex-1 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (error || !ong) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader page="ongs" variant="public" />
        <main className="flex flex-1 flex-col items-center justify-center px-4">
          <Building2 size={48} className="mb-4 text-slate-300" />
          <h1 className="text-2xl font-bold text-slate-900">
            ONG não encontrada
          </h1>
          <p className="mt-2 text-slate-600">
            {error || "A ONG solicitada não existe."}
          </p>
          <Link
            href="/ongs"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-white hover:bg-brand-700"
          >
            Voltar para ONGs
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader page="ongs" variant="public" />

      <main className="flex-1">
        {/* HERO COM FUNDO DE IMAGEM */}
        <section className="relative bg-slate-400 py-16 md:py-24 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1639494824163-f6935be23149?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/30 to-white/40"></div>

          {/* CARD MODAL FLUTUANTE */}
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-lg transform rounded-3xl bg-white p-6 md:p-8 shadow-xl">
              {/* Icon */}
              <div className="mb-6 flex items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500">
                  <Building2 size={32} className="text-white" />
                </div>
              </div>

              {/* Conteúdo */}
              <h1 className="mb-3 text-center text-xl md:text-2xl font-extrabold text-slate-900">
                {ong.name}
              </h1>
              <p className="mb-8 text-center text-sm text-slate-600 leading-relaxed">
                Dedicados ao resgate, reabilitação e adoção responsável de
                animais em situação de vulnerabilidade. Transformando vidas, uma
                pata da cada vez, na região metropolitana de Belo Horizonte.
              </p>

              {/* Botões */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-300 px-4 py-2 font-medium text-slate-700 hover:border-brand-500 hover:text-brand-600 transition"
                >
                  <Heart
                    size={18}
                    className={
                      isFavorited ? "fill-brand-500 text-brand-500" : ""
                    }
                  />
                  Favoritar
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-300 px-4 py-2 font-medium text-slate-700 hover:border-brand-500 hover:text-brand-600 transition">
                  <Share2 size={18} />
                  Compartilhar
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CONTEÚDO PRINCIPAL - LAYOUT 2 COLUNAS */}
        <section className="bg-white py-8 md:py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:gap-12 grid-cols-1 lg:grid-cols-3">
              {/* COLUNA ESQUERDA - INFO */}
              <div className="lg:col-span-2 space-y-8 md:space-y-12">
                {/* ENTRE EM CONTATO */}
                <div>
                  <div className="mb-6 flex items-center gap-2">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                      Entre em contato
                    </h2>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/50 p-6 md:p-8">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {ong.contact && (
                        <div className="rounded-2xl border border-slate-200 p-6">
                          <Phone size={24} className="mb-3 text-brand-600" />
                          <p className="text-xs font-bold uppercase text-slate-400 mb-2">
                            Telefone
                          </p>
                          <p className="text-lg font-semibold text-slate-900">
                            {ong.contact}
                          </p>
                        </div>
                      )}

                      {ong.city && ong.state && (
                        <div className="rounded-2xl border border-slate-200 p-6">
                          <MapPin size={24} className="mb-3 text-brand-600" />
                          <p className="text-xs font-bold uppercase text-slate-400 mb-2">
                            Localização
                          </p>
                          <p className="text-lg font-semibold text-slate-900">
                            {ong.city}, {ong.state}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SOBRE A ONG */}
                  <div>
                    <div className="mt-6 mb-6 flex items-center gap-2">
                      <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                        Sobre a ONG
                      </h2>
                    </div>

                    <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 md:p-8">
                      <div className="space-y-4 text-slate-700 leading-relaxed">
                        <p>
                          Fundada em 2015, a ONG {ong.name} nasceu de um como
                          coletivo de transformar a realidade de cães e gatos
                          abandonados nas ruas de Belo Horizonte. Acreditamos
                          que cada animal merece uma segunda chance: um abrigo e
                          cuidados veterinários adequados.
                        </p>
                        <p>
                          Nossa equipe é formada por voluntários apaixonados,
                          veterinários parceiros e educadores caninos que
                          trabalham incansavelmente para reabilitar nossos
                          resgatados, tanto física quanto emocionalmente.
                        </p>
                        <p>
                          Não possuímos abrigo próprio de grande porte.
                          Trabalhamos principalmente com um sistema de lares
                          temporários, o que permite uma adaptação mais fluida
                          dos animais ao convívio doméstico e familiar antes de
                          encontrarem suas famílias de acolhimento para sempre.
                        </p>
                      </div>

                      {/* Equipe de voluntários */}
                      <div className="mt-6 flex items-center gap-3">
                        <div className="flex -space-x-3">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 ring-2 ring-white flex items-center justify-center text-white text-xs font-bold"
                            >
                              {i}
                            </div>
                          ))}
                        </div>
                        <p className="text-sm font-semibold text-slate-700">
                          Equipe de voluntários ativos
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUNA DIREITA - CTA */}
              <div className="space-y-6 self-start">
                {/* QUER ADOTAR? */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:shadow-md">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <PawPrint size={28} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-slate-900">
                    Quer adotar?
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-slate-600">
                    Temos dezenas de cães e gatos esperando por um lar amoroso.
                  </p>
                  <button className="w-full rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">
                    Ver Pets Disponíveis
                  </button>
                </div>

                {/* SEJA UM PADRINHO */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:shadow-md">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <Gift size={28} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-slate-900">
                    Seja um Padrinho
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-slate-600">
                    Ajude a custear os cuidados dos animais que ainda não foram
                    adotados.
                  </p>
                  <button className="w-full rounded-full border border-brand-600 px-6 py-3 text-sm font-semibold text-brand-600 transition hover:bg-brand-50">
                    Fazer Doação
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white pb-12 md:pb-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <PawPrint size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                  Pets disponíveis para adoção
                </p>
                <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
                  {pets.length} pet{pets.length !== 1 ? "s" : ""} da ONG{" "}
                  {ong.name}
                </h2>
              </div>
            </div>

            {pets.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {pets.map((pet) => (
                  <article
                    key={pet.id}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div
                      className="h-52 bg-slate-100 bg-cover bg-center"
                      style={{
                        backgroundImage: pet.photoUrl
                          ? `url('${pet.photoUrl}')`
                          : undefined,
                      }}
                    />
                    <div className="p-5">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            {pet.name}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {pet.species}
                          </p>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Disponível
                        </span>
                      </div>

                      <p className="text-sm text-slate-600">
                        {pet.age} ano{pet.age !== 1 ? "s" : ""} de idade
                      </p>

                      <button className="mt-4 w-full rounded-full border border-brand-600 px-4 py-2.5 text-sm font-semibold text-brand-600 transition hover:bg-brand-50">
                        Ver perfil do pet
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
                <PawPrint size={40} className="mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-semibold text-slate-900">
                  Nenhum pet disponível no momento
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Essa ONG ainda não publicou pets para adoção.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
