"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePetPhotoTransition } from "@/context/PetPhotoTransitionContext";
import { petPhotoLayoutId } from "@/lib/pet";

/** Fica montado na raiz do app. Quando um card de pet e clicado, essa foto
 *  "assume o lugar" da foto do card (mesma posicao/tamanho) e expande ate
 *  cobrir a tela inteira, cobrindo a troca de pagina. Quando a pagina do
 *  pet termina de carregar, ela mesma limpa esse overlay - como a foto em
 *  destaque da pagina usa o mesmo `layoutId`, o Framer Motion anima o
 *  encolhimento do overlay ate a posicao real da foto na pagina. */
export function PetPhotoOverlay() {
  const { overlay } = usePetPhotoTransition();

  return (
    <AnimatePresence>
      {overlay && (
        <motion.img
          key={overlay.petId}
          src={overlay.photoUrl}
          alt=""
          aria-hidden
          layoutId={petPhotoLayoutId(overlay.petId)}
          initial={{
            position: "fixed",
            top: overlay.rect.top,
            left: overlay.rect.left,
            width: overlay.rect.width,
            height: overlay.rect.height,
            borderRadius: 24,
          }}
          animate={{
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            borderRadius: 0,
          }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ objectFit: "cover", zIndex: 100 }}
          className="pointer-events-none"
        />
      )}
    </AnimatePresence>
  );
}
