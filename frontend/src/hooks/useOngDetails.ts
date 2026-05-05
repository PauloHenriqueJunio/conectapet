import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { ONG, Pet } from "@/lib/constants/ong.constants";
import { ONG_CONSTANTS } from "@/lib/constants/ong.constants";

export interface OngDataState {
  ong: ONG | null;
  pets: Pet[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook para fetchar dados da ONG e seus pets
 * Gerencia loading, erro e dados em um só lugar
 */
export function useOngDetails(ongId: string | undefined) {
  const [state, setState] = useState<OngDataState>({
    ong: null,
    pets: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!ongId) return;

    const fetchOngData = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        // Fetch de todas as ONGs e encontra a específica
        const ongs = await apiFetch<ONG[]>(
          ONG_CONSTANTS.API.ONGS_ENDPOINT
        );
        const ongData = ongs.find((item) => item.id === ongId) ?? null;

        // Fetch dos pets disponíveis
        const petsData = await apiFetch<Pet[]>(
          ONG_CONSTANTS.API.PETS_ENDPOINT(ongId)
        );

        setState({
          ong: ongData,
          pets: petsData,
          loading: false,
          error: null,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : ONG_CONSTANTS.ERRORS.LOAD_ERROR;

        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
      }
    };

    fetchOngData();
  }, [ongId]);

  return state;
}
