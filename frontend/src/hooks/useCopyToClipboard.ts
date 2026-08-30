import { useState, useCallback } from "react";

/**
 * Hook para gerenciar toast de copiar texto
 * Usa timing automático para esconder e limpar
 */
export function useCopyToClipboard() {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastExiting, setToastExiting] = useState(false);

  const handleCopyPhone = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPhone(true);
      setToastVisible(true);
      setToastExiting(false);

      // Timer para começar a fechar o toast
      window.setTimeout(() => {
        setToastExiting(true);

        // Timer para limpar completamente após animação
        window.setTimeout(() => {
          setCopiedPhone(false);
          setToastVisible(false);
          setToastExiting(false);
        }, 300);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      setCopiedPhone(false);
      setToastVisible(false);
      setToastExiting(false);
    }
  }, []);

  return {
    copiedPhone,
    toastVisible,
    toastExiting,
    handleCopyPhone,
  };
}
