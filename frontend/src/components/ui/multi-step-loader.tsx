"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type LoadingState = {
  text: string;
};

const LoaderCore = ({
  loadingStates,
  value = 0,
}: {
  loadingStates: LoadingState[];
  value?: number;
}) => {
  return (
    <div className="relative mx-auto flex max-w-md flex-col justify-start">
      {loadingStates.map((loadingState, index) => {
        const distance = Math.abs(index - value);
        const opacity = Math.max(1 - distance * 0.2, 0);

        return (
          <motion.div
            key={loadingState.text}
            className="mb-4 flex items-center gap-3 text-left"
            initial={{ opacity: 0, y: -(value * 32) }}
            animate={{ opacity, y: -(value * 32) }}
            transition={{ duration: 0.5 }}
          >
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-slate-200",
                index <= value && "border-brand-500 bg-brand-500",
              )}
            >
              {index <= value ? (
                <Check size={18} className="text-white" strokeWidth={3} />
              ) : (
                <span className="h-2 w-2 rounded-full bg-slate-300" />
              )}
            </div>
            <span
              className={cn(
                "text-lg font-medium text-slate-400",
                index === value && "text-xl font-bold text-brand-600",
                index < value && "text-slate-600",
              )}
            >
              {loadingState.text}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

interface MultiStepLoaderProps {
  loadingStates: LoadingState[];
  loading: boolean;
  duration?: number;
  loop?: boolean;
  /** A cada passo, a espera fica `slowDownFactor` vezes mais longa que a
   *  anterior — o carregamento vai ficando perceptivelmente mais devagar. */
  slowDownFactor?: number;
}

/** Duracao (em ms) do passo `stepIndex` (0-based), crescendo geometricamente
 *  a partir de `duration` conforme `slowDownFactor`. */
function getStepDuration(
  duration: number,
  slowDownFactor: number,
  stepIndex: number,
) {
  return duration * Math.pow(slowDownFactor, stepIndex);
}

/** Loader em tela cheia que percorre uma sequencia de frases enquanto uma
 *  acao assincrona (ex: criar a conta) acontece por tras. */
export function MultiStepLoader({
  loadingStates,
  loading,
  duration = 1200,
  loop = false,
  slowDownFactor = 1.4,
}: MultiStepLoaderProps) {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }

    const stepDuration = getStepDuration(duration, slowDownFactor, currentState);
    const timeout = setTimeout(() => {
      setCurrentState((prev) => {
        if (prev === loadingStates.length - 1) {
          return loop ? 0 : prev;
        }
        return prev + 1;
      });
    }, stepDuration);

    return () => clearTimeout(timeout);
  }, [currentState, loading, loop, loadingStates.length, duration, slowDownFactor]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-white/90 backdrop-blur-md"
        >
          <div className="flex flex-col items-center gap-8 px-6">
            <LoaderCore value={currentState} loadingStates={loadingStates} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
