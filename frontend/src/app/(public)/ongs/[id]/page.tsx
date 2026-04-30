"use client";

import { use, useEffect, useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { apiFetch } from "@/lib/api";
import {
  Phone,
  MapPin,
  Building2,
  ArrowLeft,
  Heart,
  Share2,
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
  const { id } = use(params);

  useEffect(() => {
    const fetchOngData = async () => {
      try {
        const ongs = await apiFetch<ONG[]>("/auth/ongs");
        const ongData = ongs.find((item) => item.id === id) ?? null;

        setOng(ongData);

        // TODO: Buscar pets da ONG
        // const petsData = await apiFetch<Pet[]>(`/pets?ongId=${id}`);
        // setPets(petsData.filter(pet => !pet.isAdopted));
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
          <h1 className="text-2xl font-bold text-slate-900">ONG não encontrada</h1>
          <p className="mt-2 text-slate-600">{error || "A ONG solicitada não existe."}</p>
          <Link
            href="/ongs"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-white hover:bg-brand-700"
          >
            <ArrowLeft size={18} />
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
        {/* HERO SECTION - INFO BÁSICA DA ONG */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <Link
              href="/ongs"
              className="mb-6 inline-flex items-center gap-2 text-brand-600 hover:text-brand-700"
            >
              <ArrowLeft size={18} />
              Voltar
            </Link>

            <div className="flex flex-col gap-8 sm:flex-row">
              {/* Avatar/Logo da ONG */}
              <div className="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600">
                <Building2 size={56} className="text-white/80" />
              </div>

              {/* Info da ONG */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h1 className="text-4xl font-extrabold text-slate-900">
                    {ong.name}
                  </h1>
                  <p className="mt-2 text-slate-600">
                    Organização parceira do ConectaPet dedicada ao resgate e adoção responsável
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3 flex-wrap">
                  <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">
                    <Heart size={18} />
                    Favoritar
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">
                    <Share2 size={18} />
                    Compartilhar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO DE CONTATO */}
        <section className="border-b border-slate-200 bg-slate-50 py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold text-slate-900">Entre em contato</h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Email */}
              {ong.email && (
                <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-100">
                  <Mail size={24} className="mb-3 text-brand-600" />
                  <h3 className="font-semibold text-slate-900">Email</h3>
                  <p className="mt-2 text-sm text-slate-600">{ong.email}</p>
                </div>
              )}

              {/* Telefone */}
              {ong.contact && (
                <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-100">
                  <Phone size={24} className="mb-3 text-brand-600" />
                  <h3 className="font-semibold text-slate-900">Telefone</h3>
                  <p className="mt-2 text-sm text-slate-600">{ong.contact}</p>
                </div>
              )}

              {/* Localização */}
              {ong.city && ong.state && (
                <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-100">
                  <MapPin size={24} className="mb-3 text-brand-600" />
                  <h3 className="font-semibold text-slate-900">Localização</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {ong.city}, {ong.state}
                  </p>
                </div>
              )}

              {/* CEP */}
              {ong.cep && (
                <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-100">
                  <Building2 size={24} className="mb-3 text-brand-600" />
                  <h3 className="font-semibold text-slate-900">CEP</h3>
                  <p className="mt-2 text-sm text-slate-600">{ong.cep}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SEÇÃO SOBRE A ONG */}
        <section className="border-b border-slate-200 py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-3xl font-bold text-slate-900">Sobre</h2>

            <div className="prose prose-sm max-w-none rounded-2xl bg-slate-50 p-8">
              <p className="text-slate-700">
                {ong.name} é uma organização dedicada ao bem-estar animal. 
                Trabalhamos no resgate, cuidado médico, e colocação responsável de pets que precisam de um novo lar.
              </p>
              {/* TODO: Adicionar descrição dinâmica da ONG quando implementado no backend */}
            </div>
          </div>
        </section>

        {/* SEÇÃO DE PETS */}
        <section className="py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold text-slate-900">
              Pets disponíveis para adoção
            </h2>

            {pets.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 py-16">
                <Heart size={48} className="mb-4 text-slate-300" />
                <p className="text-lg text-slate-600">
                  Nenhum pet disponível no momento
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pets.map((pet) => (
                  <Link
                    key={pet.id}
                    href={`/pet/${pet.id}`}
                    className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:ring-brand-200 no-underline"
                  >
                    {/* Pet Card - TODO: Implementar componente reutilizável */}
                    <div className="aspect-square overflow-hidden bg-slate-100">
                      {pet.photoUrl ? (
                        <img
                          src={pet.photoUrl}
                          alt={pet.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Heart size={48} className="text-slate-300" />
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-slate-900">{pet.name}</h3>
                      <p className="text-sm text-slate-600">
                        {pet.species} • {pet.age} ano{pet.age !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}