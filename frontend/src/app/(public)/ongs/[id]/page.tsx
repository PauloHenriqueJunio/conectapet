"use client";

import { use, useEffect, useRef, useState } from "react";
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
  Mail,
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
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastExiting, setToastExiting] = useState(false);
  const petsSectionRef = useRef<HTMLElement | null>(null);
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

  const handleScrollToPets = () => {
    petsSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleCopyPhone = async (phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedPhone(true);
      setToastVisible(true);
      setToastExiting(false);
      window.setTimeout(() => {
        setToastExiting(true);
        window.setTimeout(() => {
          setCopiedPhone(false);
          setToastVisible(false);
          setToastExiting(false);
        }, 300);
      }, 2000);
    } catch {
      setCopiedPhone(false);
      setToastVisible(false);
      setToastExiting(false);
    }
  };

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

      {toastVisible && (
        <div
          className={`fixed left-1/2 top-28 z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-3xl border border-emerald-200 bg-white px-6 py-4 text-center shadow-2xl shadow-emerald-100/60 transition-opacity duration-300 ease-out ${toastExiting ? "opacity-0" : "opacity-100"}`}
        >
          <p className="text-base font-bold text-emerald-700">
            Número copiado para a área de transferência.
          </p>
        </div>
      )}

      <main className="flex-1">
        {/* HERO COM FUNDO DE IMAGEM */}
        <section className="relative overflow-hidden bg-slate-400 py-20 md:py-28">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1639494824163-f6935be23149?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/55 to-white/50"></div>
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />

          {/* CARD MODAL FLUTUANTE */}
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl rounded-[2rem] border border-white bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.35)] md:p-12">
              <div className="mb-4 flex justify-center">
                <span className="rounded-full border border-brand-200 bg-brand-50 px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-brand-700">
                  ONG parceira
                </span>
              </div>

              {/* Icon */}
              <div className="mb-6 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 shadow-lg shadow-brand-200/80 ring-8 ring-brand-50">
                  <Building2 size={32} className="text-white" />
                </div>
              </div>

              {/* Conteúdo */}
              <h1 className="mb-4 text-center text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                {ong.name}
              </h1>
              <p className="mx-auto mb-8 max-w-2xl text-center text-base leading-relaxed text-slate-800 md:text-lg font-semibold">
                Dedicados ao resgate, reabilitação e adoção responsável de
                animais em situação de vulnerabilidade. Transformando vidas, uma
                pata da cada vez, na região metropolitana de Belo Horizonte.
              </p>

              {/* Botões */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-400 px-6 py-3 font-semibold text-slate-800 transition hover:border-brand-500 hover:text-brand-600 hover:bg-brand-50"
                >
                  <Heart
                    size={20}
                    className={isFavorited ? "fill-red-500 text-red-500" : ""}
                  />
                  Favoritar
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-slate-400 px-6 py-3 font-semibold text-slate-800 transition hover:border-brand-500 hover:text-brand-600 hover:bg-brand-50">
                  <Share2 size={20} />
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
                  <p className="mb-6 max-w-2xl text-sm leading-relaxed text-slate-500">
                    Fale diretamente com a ONG usando o canal mais rápido para a
                    sua necessidade.
                  </p>

                  <div className="grid gap-4">
                    {ong.contact && (
                      <div className="rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 p-6 transition hover:shadow-lg">
                        <div className="flex items-start gap-4">
                          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-100 shadow-sm">
                            <Phone size={28} className="text-emerald-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                              Telefone
                            </p>
                            <p className="text-xl font-bold text-slate-900 mb-4 break-all">
                              {ong.contact}
                            </p>
                            <div className="flex gap-2 flex-wrap">
                              <a
                                href={`tel:${ong.contact.replace(/\D/g, "")}`}
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-semibold transition"
                              >
                                Chamar
                              </a>
                              <button
                                type="button"
                                onClick={() =>
                                  ong.contact && handleCopyPhone(ong.contact)
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-700 px-4 py-2 text-sm font-semibold transition"
                              >
                                {copiedPhone ? "Copiado!" : "Copiar"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {ong.city && ong.state && (
                      <div className="rounded-3xl border border-blue-200/70 bg-gradient-to-br from-blue-50 via-white to-blue-50/40 p-6 transition hover:shadow-lg">
                        <div className="flex items-start gap-4">
                          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-100 shadow-sm">
                            <MapPin size={28} className="text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                              Localização
                            </p>
                            <p className="text-lg font-bold text-slate-900 mb-4">
                              {ong.city}, {ong.state}
                            </p>
                            <a
                              href={`https://maps.google.com/?q=${ong.city},${ong.state}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold transition"
                            >
                              Ver no Maps
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {ong.email && (
                      <div className="rounded-3xl border border-purple-200/70 bg-gradient-to-br from-purple-50 via-white to-purple-50/40 p-6 transition hover:shadow-lg">
                        <div className="flex items-start gap-4">
                          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-purple-100 shadow-sm">
                            <Mail size={28} className="text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                              Email
                            </p>
                            <p className="text-lg font-bold text-slate-900 mb-4 break-all">
                              {ong.email}
                            </p>
                            <div className="flex gap-2 flex-wrap">
                              <a
                                href={`mailto:${ong.email}`}
                                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm font-semibold transition"
                              >
                                Enviar Email
                              </a>
                              <button
                                onClick={() =>
                                  ong.email &&
                                  navigator.clipboard.writeText(ong.email)
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-purple-300 bg-white hover:bg-purple-50 text-purple-700 px-4 py-2 text-sm font-semibold transition"
                              >
                                Copiar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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
              <div className="space-y-6 self-start lg:sticky lg:top-28">
                {/* QUER ADOTAR? */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
                    <PawPrint size={28} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-slate-900">
                    Quer adotar?
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-slate-600">
                    Temos dezenas de cães e gatos esperando por um lar amoroso.
                  </p>
                  <button
                    type="button"
                    onClick={handleScrollToPets}
                    className="w-full rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
                  >
                    Ver Pets Disponíveis
                  </button>
                </div>

                {/* SEJA UM PADRINHO */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
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

        <section
          ref={petsSectionRef}
          className="scroll-mt-28 bg-white pb-12 md:pb-16"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 shadow-sm">
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
              <p className="max-w-xl text-sm leading-relaxed text-slate-500 sm:text-right">
                Toque no pet para ver o perfil completo e iniciar a adoção.
              </p>
            </div>

            {pets.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {pets.map((pet) => (
                  <Link
                    key={pet.id}
                    href={`/pet/${pet.id}`}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
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

                      <span className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-brand-600 px-4 py-2.5 text-sm font-semibold text-brand-600 transition group-hover:bg-brand-50">
                        Ver perfil do pet
                      </span>
                    </div>
                  </Link>
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
