"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Pet } from "@/types/api";
import {
  ArrowLeft,
  MapPin,
  Camera,
  Heart,
  CheckCircle2,
  MessageCircle,
  Info,
  ShieldCheck,
} from "lucide-react";

export default function PetProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPetDetails = async () => {
      if (!id) return;

      try {
        const data = await apiFetch<Pet>(`/pets/${id}`);
        console.log("DADOS DA MEL CHEGARAM NO FRONT:", data);
        setPet(data);
      } catch (err) {
        console.error("ERRO REAL QUE O FRONTEND DEU:", err);
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

  // retirar dado mockado e colocar o numero real que vem da API quando tiver
  const whatsappNumber = "5582999999999";
  const whatsappMessage = encodeURIComponent(
    `Olá! Vi o perfil do(a) ${pet.name} no ConectaPet e tenho interesse em adotar!`,
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-brand-600 font-semibold mb-8 transition group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Voltar
        </button>
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
            <div className="grid grid-cols-2 gap-4 mb-8">
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
                  Médio
                </span>{" "}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="text-brand-500" size={24} />
                Saúde e Cuidados
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2 className="text-emerald-500" size={20} />
                  Vacinado(a)
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2 className="text-emerald-500" size={20} />
                  Castrado(a)
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2 className="text-emerald-500" size={20} />
                  Vermifugado(a)
                </li>
              </ul>
            </div>

            <div className="mb-10 flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-3">
                A história do(a) {pet.name}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {pet.description ||
                  "Este(a) lindão(ona) está procurando uma família cheia de amor para chamar de sua. É muito dócil, brincalhão(ona) e se dá bem com outros animais. Venha conhecer e se apaixonar!"}
              </p>
            </div>

            {!pet.isAdopted ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-[#25D366]/30 flex items-center justify-center gap-3 hover:-translate-y-1"
              >
                <MessageCircle size={24} />
                Quero Adotar
              </a>
            ) : (
              <div className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold text-lg text-center border border-slate-200 cursor-not-allowed">
                Este pet já encontrou um lar! 🏡
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
