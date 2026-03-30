"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Pet } from "@/types/api";
import {
  ArrowLeft,
  MapPin,
  Camera,
  Heart,
  CheckCircle2,
  Info,
  ShieldCheck,
  XCircle,
  Syringe,
  Stethoscope,
  Share2,
  Building2,
  Check,
} from "lucide-react";

export default function PetProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPetDetails = async () => {
      if (!id) return;

      try {
        const data = await apiFetch<Pet>(`/pets/${id}`);
        setPet(data);
      } catch (err) {
        setError("Não foi possível carregar as informações deste pet.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPetDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
        <Info className="h-16 w-16 text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">
          Pet não encontrado
        </h2>
        <p className="text-slate-500 mt-2 max-w-md mb-6">
          {error ||
            "O pet que você está procurando não existe ou já foi adotado."}
        </p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition"
        >
          Voltar para a vitrine
        </button>
      </div>
    );
  }

  const vaccinesToShow =
    pet.species === "Gato"
      ? [
          {
            label: "Múltipla Felina",
            taken: pet.hasVaccineFeline,
            desc: "Protege contra as principais doenças virais, como rinotraqueíte e panleucopenia.",
          },
          {
            label: "Antirrábica",
            taken: pet.hasVaccineRabies,
            desc: "Vacina obrigatória por lei. Protege contra o vírus da raiva.",
          },
          {
            label: "FeLV",
            taken: pet.hasVaccineFelv,
            desc: "Protege contra o Vírus da Leucemia Felina, doença grave e contagiosa entre gatos.",
          },
        ]
      : [
          {
            label: "Múltipla (V8/V10)",
            taken: pet.hasVaccineV8,
            desc: "Protege contra Cinomose, Parvovirose, Leptospirose e outras doenças graves.",
          },
          {
            label: "Antirrábica",
            taken: pet.hasVaccineRabies,
            desc: "Vacina obrigatória por lei. Protege contra o vírus da raiva.",
          },
          {
            label: "Giárdia",
            taken: pet.hasVaccineGiardia,
            desc: "Previne infecções intestinais causadas pelo protozoário Giárdia.",
          },
          {
            label: "Gripe Canina",
            taken: pet.hasVaccineFlu,
            desc: "Protege contra a 'tosse dos canis', uma doença respiratória altamente contagiosa.",
          },
        ];

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.error("Erro ao copiar o link:", err);
    }
  };

  const whatsappNumber = "558299999999"; // Substitua pelo número real da ONG ou responsável
  const whatsappMessage = encodeURIComponent(
    `Olá! Vi o perfil do(a) ${pet.name} no ConectaPet e tenho interesse em adotar!`,
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        {/* BARRA SUPERIOR: VOLTAR & COMPARTILHAR */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-brand-600 bg-white border border-brand-200 hover:bg-brand-50 hover:border-brand-300 transition-all duration-300 group shadow-sm"
          >
            <ArrowLeft
              size={18}
              strokeWidth={3}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Voltar
          </button>

          <button
            onClick={handleShare}
            className={`flex items-center gap-2 font-semibold transition-all duration-300 px-4 py-2 rounded-full shadow-sm border overflow-hidden ${
              isCopied
                ? "bg-emerald-50 text-emerald-600 border-emerald-200 w-[160px] justify-center"
                : "bg-white text-slate-500 hover:text-brand-600 border-slate-200 w-[44px] sm:w-[155px] justify-center"
            }`}
          >
            {isCopied ? (
              <>
                <Check size={18} className="animate-in zoom-in" />
                <span className="animate-in fade-in whitespace-nowrap">
                  Link copiado!
                </span>
              </>
            ) : (
              <>
                <Share2
                  size={18}
                  className="transition-transform group-hover:scale-110"
                />
                <span className="hidden sm:inline whitespace-nowrap">
                  Compartilhar
                </span>
              </>
            )}
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 relative bg-slate-100 flex items-center justify-center min-h-[400px] lg:min-h-full">
            {pet.photoUrl ? (
              <img
                src={pet.photoUrl}
                alt={pet.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <Camera size={64} className="mb-4 opacity-30" />
                <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
                  Pet sem foto
                </span>
              </div>
            )}

            {pet.isAdopted && (
              <div className="absolute top-6 left-6 bg-brand-600 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                <Heart size={18} fill="currentColor" />
                Já Adotado!
              </div>
            )}
          </div>
          <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {pet.name}
              </h1>
              <span className="bg-brand-50 text-brand-700 px-4 py-1.5 rounded-full text-sm font-bold border border-brand-200">
                {pet.species === "Gato" ? "🐱 Gato" : "🐶 Cão"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-500 mb-8 font-medium">
              <MapPin size={18} className="text-brand-500" />
              <span>Abrigo Parceiro (Maceió, AL)</span>
            </div>

            {/* ADICIONADO O CARD DE SEXO NA GRID */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Idade
                </span>
                <span className="text-lg font-bold text-slate-800">
                  {pet.age} {pet.age === 1 ? "ano" : "anos"}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Porte
                </span>
                <span className="text-lg font-bold text-slate-800">
                  {pet.size || "Médio"}
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 col-span-2 md:col-span-1">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Sexo
                </span>
                <span className="text-lg font-bold text-slate-800">
                  {pet.sex || "Não informado"}
                </span>
              </div>
            </div>

            <div className="mb-8 border-t border-slate-100 pt-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="text-brand-500" size={24} />
                Saúde e Cuidados
              </h3>

              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold border transition-colors ${pet.isCastrated ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-500"}`}
                  >
                    {pet.isCastrated ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <XCircle size={18} />
                    )}
                    {pet.isCastrated ? "Castrado(a)" : "Não castrado(a)"}
                  </div>
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold border transition-colors ${pet.isDewormed ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-500"}`}
                  >
                    {pet.isDewormed ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <XCircle size={18} />
                    )}
                    {pet.isDewormed ? "Vermifugado(a)" : "Não vermifugado(a)"}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                    <Syringe className="text-brand-500" size={18} />
                    Vacinas
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {vaccinesToShow.map((vaccine, index) => (
                      <li
                        key={index}
                        className={`group relative flex items-center gap-2 w-max cursor-help ${vaccine.taken ? "text-slate-700" : "text-slate-400"}`}
                      >
                        {vaccine.taken ? (
                          <CheckCircle2
                            className="text-emerald-500 min-w-[18px]"
                            size={18}
                          />
                        ) : (
                          <XCircle
                            className="text-red-400 min-w-[18px]"
                            size={18}
                          />
                        )}

                        <span
                          className={
                            vaccine.taken
                              ? "font-medium"
                              : "line-through opacity-70"
                          }
                        >
                          {vaccine.label}
                        </span>

                        <Info size={14} className="text-slate-300 ml-1" />

                        <div className="absolute left-0 bottom-full mb-2 hidden w-56 -translate-x-2 flex-col rounded-xl bg-slate-900 px-3 py-2.5 text-xs text-white opacity-0 transition-opacity group-hover:flex group-hover:opacity-100 z-10 shadow-xl pointer-events-none">
                          <span className="font-bold text-emerald-400 mb-1">
                            {vaccine.label}
                          </span>
                          <span className="text-slate-300 leading-relaxed">
                            {vaccine.desc}
                          </span>

                          <div className="absolute -bottom-1 left-4 h-2 w-2 rotate-45 bg-slate-900"></div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {(pet.hasHistoryOfIllness || pet.hasOtherHealthInfo) && (
                  <div className="p-5 bg-amber-50/80 rounded-2xl border border-amber-200/60 shadow-sm">
                    <h4 className="text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
                      <Stethoscope className="text-amber-600" size={18} />
                      Histórico Médico
                    </h4>

                    <div className="space-y-4">
                      {pet.hasHistoryOfIllness && (
                        <div>
                          <span className="block text-[11px] font-extrabold text-amber-700 uppercase tracking-wider mb-1">
                            Doenças / Tratamentos
                          </span>
                          <p className="text-sm text-amber-900 font-medium leading-relaxed">
                            {pet.illnessDescription ||
                              "Possui histórico. Consulte a ONG para mais detalhes."}
                          </p>
                        </div>
                      )}

                      {pet.hasOtherHealthInfo && (
                        <div>
                          <span className="block text-[11px] font-extrabold text-amber-700 uppercase tracking-wider mb-1">
                            Outras Informações
                          </span>
                          <p className="text-sm text-amber-900 font-medium leading-relaxed">
                            {pet.otherHealthInfoDescription ||
                              "Consulte a ONG para detalhes adicionais."}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8 flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                A história do(a) {pet.name}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {pet.description ||
                  "Este(a) lindão(ona) está procurando uma família cheia de amor para chamar de sua. É muito dócil, brincalhão(ona) e se dá bem com outros animais. Venha conhecer e se apaixonar!"}
              </p>
            </div>

            {/* CARD DO RESPONSÁVEL / ONG */}
            <div className="mb-6 flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50">
              <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 shrink-0">
                <Building2 size={24} />
              </div>
              <div>
                <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-0.5">
                  Responsável pelo pet
                </span>
                {/* Aqui futuramente podemos trocar por pet.ong?.name se vier da API */}
                <span className="text-sm font-bold text-slate-800">
                  {/* @ts-ignore - Remova isso quando adicionar 'ong' no types/api.ts */}
                  {pet.ong?.name || "Abrigo Parceiro (ONG)"}
                </span>
              </div>
            </div>

            {pet.isAdopted ? (
              <div className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold text-lg text-center border border-slate-200 cursor-not-allowed">
                Este pet já encontrou um lar!
              </div>
            ) : isAuthenticated ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-[#25D366]/30 flex items-center justify-center gap-3 hover:-translate-y-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Quero Adotar
              </a>
            ) : (
              <div className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-4 shadow-inner">
                <p className="text-slate-600 font-medium text-sm leading-relaxed">
                  Para seguir com a adoção você precisa estar logado.
                  <br />
                  Caso não tenha uma conta, crie uma!
                </p>
                <div className="flex gap-3 w-full">
                  <Link
                    href="/login"
                    className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-3 rounded-xl font-bold transition-colors shadow-sm"
                  >
                    Fazer Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex-1 bg-white hover:bg-slate-100 text-brand-600 border border-brand-200 py-3 rounded-xl font-bold transition-colors shadow-sm"
                  >
                    Criar Conta
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
