import { TourDefinition } from "@/constants/tours/types";

const TOUR_KEY_PREFIX = "pokedex_tour_";

export const tourStorageKey = (tour: TourDefinition, userId: string) =>
  `${TOUR_KEY_PREFIX}${tour.id}_v${tour.version}_${userId}`;

/**
 * Só em desenvolvimento: para testar o primeiro acesso, abra o console (F12)
 * e rode `resetTourForTesting()`. Todas as chaves de tour são apagadas e a página recarrega.
 */
const resetTourForTesting = () => {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(TOUR_KEY_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
    window.location.reload();
  } catch (error) {
    console.error("Erro ao resetar tour:", error);
  }
};

export const exposeTourDevTools = () => {
  if (process.env.NODE_ENV === "production" || typeof window === "undefined") return;
  (window as unknown as { resetTourForTesting: () => void }).resetTourForTesting = resetTourForTesting;
};
