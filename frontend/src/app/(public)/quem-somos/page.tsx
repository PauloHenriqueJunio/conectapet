export default function QuemSomosPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-brand-600 via-brand-500 to-emerald-500 px-6 py-12 text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)] sm:px-10 lg:px-14 lg:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.28),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.16),_transparent_30%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/90 backdrop-blur-sm">
              Quem somos
            </span>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Tecnologia com propósito para transformar adoções.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/88 sm:text-lg">
              O ConectaPet aproxima ONGs, pets e pessoas que querem adotar com
              uma experiência clara, humana e organizada. O foco é reduzir o
              atrito da jornada e ajudar mais animais a encontrarem um lar com
              responsabilidade.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-white/20 bg-white/12 p-5 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                Missão
              </p>
              <p className="mt-2 text-sm leading-6 text-white/92">
                Conectar pets, ONGs e adotantes com segurança, empatia e
                transparência.
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/12 p-5 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                Visão
              </p>
              <p className="mt-2 text-sm leading-6 text-white/92">
                Ser uma referência em adoção responsável e digital no Brasil.
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/12 p-5 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                Valores
              </p>
              <p className="mt-2 text-sm leading-6 text-white/92">
                Bem-estar animal, confiança, impacto social e cuidado em cada
                etapa.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <article className="rounded-[1.75rem] border border-slate-200/80 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">
            Nosso ponto de partida
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Uma plataforma pensada para simplificar a adoção.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            A ideia do ConectaPet é diminuir a distância entre quem resgata e
            quem adota. Em vez de uma jornada fragmentada, centralizamos
            informações, perfis e processos em um fluxo visual mais simples de
            navegar.
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Isso ajuda ONGs a organizarem seus pets com mais clareza e oferece
            para quem deseja adotar uma experiência mais confiável, acolhedora e
            objetiva.
          </p>
        </article>

        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
              01
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Mais clareza
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Dados organizados, navegação direta e passos mais fáceis de
              entender.
            </p>
          </article>

          <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              02
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Mais confiança
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Informações consistentes para apoiar decisões responsáveis.
            </p>
          </article>

          <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              03
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Mais cuidado
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              A jornada foi desenhada para valorizar o bem-estar do animal.
            </p>
          </article>

          <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200 text-slate-700">
              04
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Mais impacto
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Pequenas melhorias de fluxo ajudam a acelerar adoções reais.
            </p>
          </article>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white p-8 shadow-sm sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">
              Próximo passo
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Uma base visual melhor para evoluir a página.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Este primeiro refactor já deixa a rota pronta para receber mais
              conteúdo, fotos, depoimentos ou uma linha do tempo da história do
              projeto, sem mudar a estrutura principal.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5 text-center">
              <p className="text-3xl font-black text-slate-900">100%</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                foco em adoção
              </p>
            </div>
            <div className="rounded-2xl bg-brand-50 p-5 text-center">
              <p className="text-3xl font-black text-brand-700">3</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700/70">
                pilares centrais
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-5 text-center">
              <p className="text-3xl font-black text-emerald-700">1</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700/70">
                jornada clara
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
