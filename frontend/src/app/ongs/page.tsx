import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

const ONGS = [
  {
    name: "ONG Amor Animal",
    city: "Sao Paulo, SP",
    focus: "Resgate e adocao de caes e gatos",
    contact: "contato@ongamoranimal.org",
  },
  {
    name: "Instituto Patinhas Felizes",
    city: "Campinas, SP",
    focus: "Cuidado veterinario e adocao responsavel",
    contact: "patinhas@instituto.org",
  },
  {
    name: "Projeto Lar Pet",
    city: "Belo Horizonte, MG",
    focus: "Acolhimento temporario e feiras de adocao",
    contact: "larpet@projeto.org",
  },
];

export default function OngsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <SiteHeader page="ongs" />

      <section className="mb-6 rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-100">
        <h1 className="text-3xl font-bold text-slate-900">Verificar ONGS</h1>
        <p className="mt-2 text-sm text-slate-600">
          Encontre organizacoes parceiras e escolha com quem iniciar o processo
          de adocao.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ONGS.map((ong) => (
          <article
            key={ong.name}
            className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-slate-100"
          >
            <h2 className="text-xl font-bold text-slate-800">{ong.name}</h2>
            <p className="mt-1 text-sm text-slate-600">{ong.city}</p>
            <p className="mt-3 text-sm text-slate-700">{ong.focus}</p>
            <p className="mt-3 text-sm font-medium text-brand-700">
              {ong.contact}
            </p>
          </article>
        ))}
      </section>

      <SiteFooter />
    </main>
  );
}
