import { useEffect, useState } from "react";

interface BrasilApiCepResponse {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface UseCepLookupParams {
  cep: string;
  onAddressResolved: (address: string) => void;
  onErrorClear: () => void;
}

export function useCepLookup({
  cep,
  onAddressResolved,
  onErrorClear,
}: UseCepLookupParams) {
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const fetchAddress = async () => {
      const cleanCep = cep.replace(/\D/g, "");

      if (cleanCep.length !== 8) {
        setIsLoadingCep(false);
        return;
      }

      setIsLoadingCep(true);

      try {
        const response = await fetch(
          `https://brasilapi.com.br/api/cep/v1/${cleanCep}`,
        );

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as BrasilApiCepResponse;
        const formattedAddress = `${data.street}, ${data.neighborhood} - ${data.city}/${data.state}`;

        if (!isCancelled) {
          onAddressResolved(formattedAddress);
          onErrorClear();
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Erro ao buscar CEP", error);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingCep(false);
        }
      }
    };

    fetchAddress();

    return () => {
      isCancelled = true;
    };
  }, [cep, onAddressResolved, onErrorClear]);

  return {
    isLoadingCep,
  };
}
