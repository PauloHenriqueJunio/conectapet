"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

type OverlayRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type OverlayState = {
  petId: string;
  photoUrl: string;
  rect: OverlayRect;
} | null;

type PetPhotoTransitionValue = {
  overlay: OverlayState;
  startPhotoExpand: (petId: string, photoUrl: string, rect: OverlayRect) => void;
  clearPhotoExpand: () => void;
};

const PetPhotoTransitionContext =
  createContext<PetPhotoTransitionValue | null>(null);

// Tempo maximo que o overlay fica na tela antes de sumir sozinho, caso algo
// de errado impeca a pagina de destino de limpar ele (ex: erro na API).
const OVERLAY_SAFETY_TIMEOUT_MS = 2500;

export function PetPhotoTransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [overlay, setOverlay] = useState<OverlayState>(null);
  const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPhotoExpand = useCallback(() => {
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
    setOverlay(null);
  }, []);

  const startPhotoExpand = useCallback(
    (petId: string, photoUrl: string, rect: OverlayRect) => {
      setOverlay({ petId, photoUrl, rect });

      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = setTimeout(() => {
        setOverlay(null);
      }, OVERLAY_SAFETY_TIMEOUT_MS);
    },
    [],
  );

  return (
    <PetPhotoTransitionContext.Provider
      value={{ overlay, startPhotoExpand, clearPhotoExpand }}
    >
      {children}
    </PetPhotoTransitionContext.Provider>
  );
}

export function usePetPhotoTransition() {
  const ctx = useContext(PetPhotoTransitionContext);
  if (!ctx) {
    throw new Error(
      "usePetPhotoTransition deve ser usado dentro de PetPhotoTransitionProvider",
    );
  }
  return ctx;
}
