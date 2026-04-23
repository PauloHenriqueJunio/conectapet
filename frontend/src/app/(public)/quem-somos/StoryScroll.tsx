"use client";

import { useEffect, useRef, useState } from "react";

const STORY_ITEMS = [
  {
    title: "A primeira manchete abre a dor do problema.",
    text: "Aqui entra a primeira imagem de jornal, trazendo o impacto inicial e preparando o visitante para entender por que o ConectaPet existe.",
    label: "Imagem de jornal 01",
    caption: "primeira manchete em destaque",
    image:
      "https://res.cloudinary.com/du0yit3co/image/upload/v1776955669/efcf6f59-f3a8-4ceb-866c-6c85a3fb4845_jbnusw.png",
    mobileImage:
      "https://res.cloudinary.com/du0yit3co/image/upload/v1776958306/meotropoles_mobile_xnxlca.png",
    alt: "Cachorro olhando para a câmera",
    imageFit: "object-contain",
    imagePosition: "object-top",
    imageHeight: "h-[14rem] sm:h-[16rem] lg:h-[18rem]",
    frameBg: "bg-slate-100",
    activeScale: "scale-100",
  },
  {
    title: "Os recortes mostram que o abandono não é um caso isolado.",
    text: "Nesta etapa, você pode destacar outra imagem de jornal, um dado ou uma manchete complementar para aprofundar o contexto.",
    label: "Imagem de jornal 02",
    caption: "recorte que reforça o contexto",
    image:
      "https://res.cloudinary.com/du0yit3co/image/upload/v1776956370/1dc5e647-9311-4df6-b950-c709bc7f3825_f4xzp3.png",
    mobileImage:
      "https://res.cloudinary.com/du0yit3co/image/upload/v1776960527/AGENCIA_MOBILE_ngubds.png",
    alt: "Gato sentado olhando para frente",
    imageFit: "object-contain",
    imagePosition: "object-top",
    imageHeight: "h-[14rem] sm:h-[16rem] lg:h-[18rem]",
    frameBg: "bg-slate-100",
    activeScale: "scale-100",
  },
  {
    title: "A narrativa fecha conectando problema e transformação.",
    text: "O último bloco pode fechar com a imagem mais forte e conduzir para a missão do projeto: transformar atenção em adoção.",
    label: "Imagem de jornal 03",
    caption: "desfecho emocional da história",
    image:
      "https://res.cloudinary.com/du0yit3co/image/upload/v1776956370/4efec5ba-f923-4ee8-a6c2-d5536c843f97_lue3bg.png",
    mobileImage:
      "https://res.cloudinary.com/du0yit3co/image/upload/v1776960129/CNN_MOBILE_peun0j.png",
    alt: "Cachorro deitado em ambiente externo",
    imageFit: "object-contain",
    imagePosition: "object-top",
    imageHeight: "h-[14rem] sm:h-[16rem] lg:h-[18rem]",
    frameBg: "bg-slate-100",
    activeScale: "scale-100",
  },
];

export function StoryScroll() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [revealedIndexes, setRevealedIndexes] = useState<Set<number>>(
    new Set(),
  );
  const chapterRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    if (activeIndex < 0) return;

    setRevealedIndexes((previous) => {
      if (previous.has(activeIndex)) return previous;
      const next = new Set(previous);
      next.add(activeIndex);
      return next;
    });
  }, [activeIndex]);

  useEffect(() => {
    let rafId = 0;

    const updateActiveChapter = () => {
      const triggerLine = window.innerHeight * 0.55;
      let bestIndex = -1;
      let bestDistance = Number.POSITIVE_INFINITY;

      chapterRefs.current.forEach((element, index) => {
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const isVisibleEnough =
          rect.top < window.innerHeight * 0.9 &&
          rect.bottom > window.innerHeight * 0.1;

        if (!isVisibleEnough) {
          return;
        }

        const chapterCenter = rect.top + rect.height / 2;
        const distance = Math.abs(chapterCenter - triggerLine);

        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });

      setActiveIndex((previous) =>
        previous === bestIndex ? previous : bestIndex,
      );
      rafId = 0;
    };

    const onScrollOrResize = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateActiveChapter);
    };

    onScrollOrResize();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
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

        <div className="flex-1 space-y-10 pb-16 sm:space-y-20 sm:pb-20">
          {STORY_ITEMS.map((item, index) => {
            const isActive = index === activeIndex;
            const isTextVisible = revealedIndexes.has(index);
            const isImageVisible = revealedIndexes.has(index);

            return (
              <article
                key={item.label}
                ref={(element) => {
                  chapterRefs.current[index] = element;
                }}
                data-index={index}
                className="flex min-h-[72vh] flex-col gap-6 sm:min-h-[100vh] lg:gap-8"
              >
                <div
                  className={`max-w-2xl transition-all duration-700 ease-out ${
                    isTextVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-6 opacity-0"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300">
                    Capítulo {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
                    {item.text}
                  </p>
                </div>

                <div
                  className={`flex-none overflow-hidden rounded-none border border-white/10 ${item.frameBg} shadow-[0_30px_80px_rgba(0,0,0,0.45)] transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:flex-1 sm:rounded-[2.5rem] ${
                    isImageVisible
                      ? "translate-y-0 scale-100 opacity-100 blur-0"
                      : "translate-y-10 scale-[0.95] opacity-0 blur-[2px]"
                  }`}
                >
                  <div className="relative mx-auto aspect-[397/484] w-[100vw] max-w-[25rem] overflow-hidden bg-white sm:hidden">
                    <img
                      src={item.mobileImage ?? item.image}
                      alt={item.alt}
                      className={`absolute inset-0 h-full w-full object-cover object-[center_28%] transition-[transform,opacity,filter] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isImageVisible
                          ? "scale-100 opacity-100 saturate-100"
                          : "scale-100 opacity-80 saturate-75"
                      }`}
                    />
                  </div>

                  <div className="relative hidden h-full sm:block">
                    <img
                      src={item.image}
                      alt={item.alt}
                      className={`h-full w-full ${item.imageFit} ${item.imagePosition} transition-[transform,opacity,filter] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isImageVisible
                          ? "scale-100 opacity-100 saturate-100"
                          : "scale-100 opacity-80 saturate-75"
                      }`}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-950/80 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <div className="max-w-sm rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-4 backdrop-blur-md">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">
                          {item.label}
                        </p>
                        <p className="mt-2 text-lg font-bold leading-6 text-white sm:text-xl">
                          {item.caption}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
