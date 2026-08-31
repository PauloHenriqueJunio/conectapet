import Link from "next/link";

export default function QuemSomosPage() {
  return (
    <div className="flex w-full flex-col gap-10 pt-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-brand-600 via-brand-500 to-emerald-500 px-6 py-12 text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)] sm:px-10 lg:px-14 lg:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.28),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.16),_transparent_30%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/90 backdrop-blur-sm">
                Quem somos
              </span>
              <h1 className="mt-5 max-w-xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                Tecnologia com propósito para tornar a adoção mais humana.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/90 sm:text-lg lg:text-xl">
                O ConectaPet conecta ONGs, pets e pessoas interessadas em adotar
                em uma experiência clara, acolhedora e organizada. A ideia é
                reduzir atritos, dar visibilidade aos animais e apoiar decisões
                mais responsáveis.
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
                  Ser uma referência em adoção responsável no ambiente digital.
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
              Uma plataforma pensada para simplificar cada passo da adoção.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              O objetivo do ConectaPet é diminuir a distância entre quem resgata
              e quem adota. Em vez de uma jornada fragmentada, reunimos
              informações, perfis e processos em um fluxo visual mais simples de
              navegar.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Isso ajuda ONGs a organizarem seus pets com mais clareza e oferece
              para quem deseja adotar uma experiência mais confiável,
              acolhedora e objetiva.
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

        <section>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">
              O contexto
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Os números que mostram por que isso importa.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Cada card reúne um dado real sobre abandono e adoção no Brasil,
              com a fonte original linkada — para conectar a dimensão do
              problema ao propósito do ConectaPet sem se apropriar do
              trabalho de quem noticiou.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <article className="flex flex-col rounded-[1.75rem] border border-slate-200/80 bg-white p-8 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                O abandono
              </p>
              <h3 className="mt-2 text-lg font-bold text-slate-900">
                Abandono ainda é notícia e isso não pode virar normal.
              </h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                Casos de abandono em via pública continuam sendo registrados
                pelo país. Cada um reforça por que iniciativas de proteção e
                adoção responsável são urgentes.
              </p>
              <a
                href="https://www.metropoles.com"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline"
              >
                Fonte: Metrópoles
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17 17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
            </article>

            <article className="flex flex-col rounded-[1.75rem] border border-slate-200/80 bg-white p-8 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                O contexto nacional
              </p>
              <h3 className="mt-2 text-lg font-bold text-slate-900">
                Cerca de 30 milhões de animais domésticos vivem abandonados
                no Brasil.
              </h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                O número mostra a dimensão do problema no país e reforça que
                o abandono exige ação contínua de proteção, conscientização
                e cuidado.
              </p>
              <a
                href="https://agenciabrasil.ebc.com.br"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline"
              >
                Fonte: Agência Brasil
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17 17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
            </article>

            <article className="flex flex-col rounded-[1.75rem] border border-slate-200/80 bg-white p-8 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                A adoção como resposta
              </p>
              <h3 className="mt-2 text-lg font-bold text-slate-900">
                A maioria dos pets em lares brasileiros veio de adoção.
              </h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                Esse recorte mostra que a adoção já transforma vidas em larga
                escala e que fortalecer esse caminho pode gerar um impacto
                ainda maior.
              </p>
              <a
                href="https://www.cnnbrasil.com.br"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline"
              >
                Fonte: CNN Brasil
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17 17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </a>
            </article>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200/80 bg-white p-8 shadow-sm sm:p-10">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">
              Por quê o ConectaPet foi criado?
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Um projeto acadêmico que cresceu para algo maior.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              O ConectaPet nasceu como um projeto acadêmico, criado para unir
              aprendizado técnico e uma causa social real. A ideia surgiu da
              vontade de aplicar o desenvolvimento de software em um cenário que
              pudesse gerar impacto positivo, aproximando pessoas, ONGs e
              animais que precisam de um novo lar.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Com o tempo, o projeto passou a representar mais do que apenas uma
              entrega acadêmica. Ele se tornou uma base para apoiar o processo
              de adoção de forma mais organizada, humana e acessível, com espaço
              para crescer e receber novas melhorias ao longo do tempo.
            </p>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-200/80 bg-white p-8 shadow-sm sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-600">
                Faça parte
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                Você também pode fazer parte dessa mudança.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
                Seja adotando com responsabilidade ou ajudando uma ONG a
                ganhar visibilidade, cada ação no ConectaPet aproxima um
                animal de um novo lar.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/pessoa-fisica/home"
                  className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  Quero adotar
                </Link>
                <Link
                  href="/register?role=ONG"
                  className="rounded-xl border border-brand-500 px-5 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
                >
                  Sou uma ONG
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-brand-200 bg-brand-50 p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-brand-700"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  Adoção responsável, do jeito certo.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-brand-700"
                  >
                    <path d="M3 21h18" />
                    <path d="M5 21V7l8-4v18" />
                    <path d="M19 21V11l-6-4" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  ONGs com mais visibilidade e organização.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-brand-700"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  Um processo mais claro, do início ao fim.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
