import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function QuemSomosPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <SiteHeader page="quem-somos" />

      <section className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-100">
        <h1 className="text-3xl font-bold text-slate-900">Quem somos?</h1>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          O ConectaPet nasceu para aproximar ONGs e adotantes em uma experiência
          simples, transparente e humana. Nosso objetivo é facilitar adoções
          responsáveis por meio de tecnologia, reduzindo o tempo entre o resgate
          e o encontro com um novo lar.
        </p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Missão</h2>
          <p className="mt-2 text-sm text-slate-600">
            Conectar pets, ONGs e adotantes com segurança e empatia.
          </p>
        </article>
        <article className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Visão</h2>
          <p className="mt-2 text-sm text-slate-600">
            Ser a plataforma de referência em adoção responsável no Brasil.
          </p>
        </article>
        <article className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Valores</h2>
          <p className="mt-2 text-sm text-slate-600">
            Bem-estar animal, confiança, transparência e impacto social.
          </p>
        </article>
      </section>

      <SiteFooter />
    </main>
  );
}
