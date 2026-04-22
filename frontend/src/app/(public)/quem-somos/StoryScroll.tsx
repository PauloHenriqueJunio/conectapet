"use client";

import { useEffect, useRef, useState } from "react";

const STORY_ITEMS = [
  {
    title: "A primeira manchete abre a dor do problema.",
    text: "Aqui entra a primeira imagem de jornal, trazendo o impacto inicial e preparando o visitante para entender por que o ConectaPet existe.",
    label: "Imagem de jornal 01",
    caption: "primeira manchete em destaque",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1400&q=80",
    alt: "Cachorro olhando para a câmera",
  },
  {
    title: "Os recortes mostram que o abandono não é um caso isolado.",
    text: "Nesta etapa, você pode destacar outra imagem de jornal, um dado ou uma manchete complementar para aprofundar o contexto.",
    label: "Imagem de jornal 02",
    caption: "recorte que reforça o contexto",
    image:
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1400&q=80",
    alt: "Gato sentado olhando para frente",
  },
  {
    title: "A narrativa fecha conectando problema e transformação.",
    text: "O último bloco pode fechar com a imagem mais forte e conduzir para a missão do projeto: transformar atenção em adoção.",
    label: "Imagem de jornal 03",
    caption: "desfecho emocional da história",
    image:
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1400&q=80",
    alt: "Cachorro deitado em ambiente externo",
  },
];

export function StoryScroll() {
  const [activeIndex, setActiveIndex] = useState(0);
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) => right.intersectionRatio - left.intersectionRatio,
          );

        if (visibleEntries[0]) {
          const index = Number(
            (visibleEntries[0].target as HTMLElement).dataset.index,
          );
          if (!Number.isNaN(index)) {
            setActiveIndex(index);
          }
        }
      },
      {
        threshold: [0.25, 0.4, 0.6, 0.8],
        rootMargin: "-10% 0px -20% 0px",
      },
    );

    chapterRefs.current.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-3xl pb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">
            Narrativa visual
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            A história vai se revelando conforme a pessoa desce a página.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Este trecho ocupa a tela inteira para criar uma experiência mais
            emocional. A cada rolagem, novas imagens de jornais e recortes podem
            aparecer, ajudando a contar o contexto de abandono e maus- tratos
            que motivou o projeto.
          </p>
        </div>

        <div className="grid flex-1 gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <div className="space-y-24 pb-20 lg:space-y-[24vh]">
            {STORY_ITEMS.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <article
                  key={item.label}
                  ref={(element) => {
                    chapterRefs.current[index] = element;
                  }}
                  data-index={index}
                  className={`min-h-[76vh] rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-700 ease-out ${
                    isActive
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-55"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300">
                    Capítulo {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                    {item.text}
                  </p>
                  <div className="mt-8 h-px w-20 bg-white/15" />
                  <p className="mt-4 text-xs uppercase tracking-[0.22em] text-slate-400">
                    role para avançar o próximo quadro
                  </p>
                </article>
              );
            })}
          </div>

          <div className="relative hidden lg:block">
            <div className="sticky top-24">
              <div className="relative min-h-[82vh]">
                {STORY_ITEMS.map((item, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <div
                      key={item.label}
                      className={`absolute inset-0 transition-all duration-700 ease-out ${
                        isActive
                          ? "translate-y-0 scale-100 opacity-100"
                          : index < activeIndex
                            ? "-translate-y-6 scale-[0.96] opacity-0"
                            : "translate-y-6 scale-[0.96] opacity-0"
                      }`}
                    >
                      <div
                        className={`overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900 shadow-[0_30px_80px_rgba(0,0,0,0.45)] transition-transform duration-700 ${
                          isActive ? "scale-100" : "scale-[0.98]"
                        }`}
                      >
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.alt}
                            className={`h-[34rem] w-full object-cover transition-transform duration-1000 ${
                              isActive ? "scale-105" : "scale-100"
                            }`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
                          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                            <div className="max-w-md rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5 backdrop-blur-md">
                              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                                {item.label}
                              </p>
                              <p className="mt-3 text-2xl font-bold text-white">
                                {item.caption}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
