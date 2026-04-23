"use client";

import { useEffect, useRef, useState } from "react";

const STORY_ITEMS = [
  {
    title: "Quando o abandono vira notícia.",
    text: "Esse caso mostra, de forma dura, como o abandono ainda acontece e por que iniciativas de proteção e adoção responsável são urgentes.",
    label: "Manchete 01",
    caption: "O abandono",
    image:
      "https://res.cloudinary.com/du0yit3co/image/upload/v1776955669/efcf6f59-f3a8-4ceb-866c-6c85a3fb4845_jbnusw.png",
    mobileImage:
      "https://res.cloudinary.com/du0yit3co/image/upload/v1776958306/meotropoles_mobile_xnxlca.png",
    alt: "Captura de reportagem sobre abandono de cachorros em via pública durante a noite",
    imageFit: "object-cover",
    imagePosition: "object-center",
    frameBg: "bg-slate-100",
    activeScale: "scale-100",
  },
  {
    title: "Brasil tem cerca de 30 milhões de animais domésticos abandonados.",
    text: "Os dados mostram a dimensão do problema no país e reforçam que o abandono exige ação contínua de proteção, conscientização e cuidado.",
    label: "Manchete 02",
    caption: "O contexto em escala nacional",
    image:
      "https://res.cloudinary.com/du0yit3co/image/upload/v1776956370/1dc5e647-9311-4df6-b950-c709bc7f3825_f4xzp3.png",
    mobileImage:
      "https://res.cloudinary.com/du0yit3co/image/upload/v1776960527/AGENCIA_MOBILE_ngubds.png",
    alt: "Dois cães em área urbana ilustrando matéria sobre animais domésticos abandonados no Brasil",
    imageFit: "object-cover",
    imagePosition: "object-center",
    frameBg: "bg-slate-100",
    activeScale: "scale-100",
  },
  {
    title:
      "Pets: pesquisa aponta que 80% dos animais nos lares do Brasil são adotados.",
    text: "Esse recorte mostra que a adoção já transforma vidas em larga escala e que fortalecer esse caminho pode gerar impacto ainda maior.",
    label: "Manchete 03",
    caption: "A adoção como resposta possível",
    image:
      "https://res.cloudinary.com/du0yit3co/image/upload/v1776956370/4efec5ba-f923-4ee8-a6c2-d5536c843f97_lue3bg.png",
    mobileImage:
      "https://res.cloudinary.com/du0yit3co/image/upload/v1776960129/CNN_MOBILE_peun0j.png",
    alt: "Mulher abraçando um cachorro em casa, representando adoção responsável",
    imageFit: "object-cover",
    imagePosition: "object-center",
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
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);

        if (visibleEntries.length === 0) {
          return;
        }

        const bestEntry = visibleEntries.reduce((currentBest, entry) =>
          entry.intersectionRatio > currentBest.intersectionRatio
            ? entry
            : currentBest,
        );

        const nextIndex = Number(bestEntry.target.getAttribute("data-index"));

        setActiveIndex((previous) =>
          previous === nextIndex ? previous : nextIndex,
        );
      },
      {
        root: null,
        threshold: [0.35, 0.55, 0.7],
        rootMargin: "-12% 0px -18% 0px",
      },
    );

    chapterRefs.current.forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    const initialVisible = chapterRefs.current.findIndex((element) => {
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      return rect.top < window.innerHeight * 0.85;
    });

    if (initialVisible >= 0) {
      setActiveIndex(initialVisible);
    }

    return () => {
      observer.disconnect();
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
            Manchetes reais que mostram o desafio e o caminho da adoção.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Cada bloco acompanha uma manchete real sobre abandono e adoção para
            conectar a dimensão do problema ao propósito do ConectaPet.
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
                className="flex min-h-[72vh] flex-col gap-4 sm:min-h-[100vh] lg:gap-5"
                style={{
                  contentVisibility: "auto",
                  containIntrinsicSize: "900px",
                }}
              >
                <div
                  className={`max-w-2xl transition-all duration-700 ease-out motion-reduce:transition-none ${
                    isTextVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-6 opacity-0"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300">
                    Capítulo {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3
                    className={`mt-2 text-2xl font-bold tracking-tight text-white transition-all duration-700 sm:text-3xl lg:text-4xl ${
                      isActive ? "sm:translate-x-0" : "sm:translate-x-0"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
                    {item.text}
                  </p>
                </div>

                <div
                  className={`w-full overflow-hidden rounded-none border border-white/10 ${item.frameBg} shadow-[0_18px_40px_rgba(0,0,0,0.32)] transition-[transform,opacity] duration-500 ease-out motion-reduce:transition-none sm:rounded-[2.5rem] will-change-[transform,opacity] ${
                    isImageVisible
                      ? "translate-y-0 scale-100 opacity-100"
                      : "translate-y-8 scale-[0.98] opacity-0"
                  }`}
                >
                  <div className="relative mx-auto aspect-[397/484] w-full max-w-[25rem] overflow-hidden bg-white sm:hidden">
                    <img
                      src={item.mobileImage ?? item.image}
                      alt={item.alt}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                      fetchPriority={index === 0 ? "high" : "auto"}
                      className={`absolute inset-0 h-full w-full object-cover object-[center_28%] transition-[transform,opacity] duration-700 ease-out motion-reduce:transition-none will-change-[transform,opacity] ${
                        isImageVisible
                          ? "scale-100 opacity-100"
                          : "scale-[1.01] opacity-85"
                      }`}
                    />
                  </div>

                  <div className="relative hidden h-[30rem] w-full overflow-hidden sm:block lg:h-[46rem]">
                    <img
                      src={item.image}
                      alt={item.alt}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                      fetchPriority={index === 0 ? "high" : "auto"}
                      className={`h-full w-full ${item.imageFit} ${item.imagePosition} transition-[transform,opacity] duration-700 ease-out motion-reduce:transition-none will-change-[transform,opacity] ${
                        isImageVisible
                          ? "scale-100 opacity-100"
                          : "scale-[1.01] opacity-85"
                      }`}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-slate-950/80 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <div
                        className={`max-w-sm rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-4 backdrop-blur-md transition-all duration-700 motion-reduce:transition-none ${
                          isActive
                            ? "translate-y-0 opacity-100"
                            : "translate-y-2 opacity-90"
                        }`}
                      >
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
