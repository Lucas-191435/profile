/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

const TOUR_COMPLETED_KEY = "pokedex_tour_completed";
const TOUR_USER_PREFIX = "pokedex_tour_user_";

export const useFirstTimeUser = () => {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: user } = useAuth();

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const checkFirstTimeUser = () => {
      try {
        // Chave específica para cada usuário
        const userTourKey = `${TOUR_USER_PREFIX}${user.id}`;

        // Verificar localStorage primeiro
        const tourCompletedGeneral = localStorage.getItem(TOUR_COMPLETED_KEY);
        const tourCompletedForUser = localStorage.getItem(userTourKey);

        // Se já completou o tour para este usuário específico
        if (tourCompletedForUser === "true") {
          setIsFirstTime(false);
          setIsLoading(false);
          return;
        }

        // Se é um tour geral completado (backward compatibility)
        if (tourCompletedGeneral === "true" && !tourCompletedForUser) {
          // Migrar para o novo sistema
          localStorage.setItem(userTourKey, "true");
          setIsFirstTime(false);
          setIsLoading(false);
          return;
        }

        // Primeiro acesso do usuário
        setIsFirstTime(true);
        setIsLoading(false);
      } catch (error) {
        // console.warn("Erro ao verificar primeiro acesso:", error);
        // Em caso de erro, assumir que é primeiro acesso
        setIsFirstTime(true);
        setIsLoading(false);
      }
    };

    checkFirstTimeUser();
  }, [user?.id]);

  const markTourAsCompleted = () => {
    if (!user?.id) {
      // eslint-disable-next-line no-console
      console.warn("❌ Cannot mark tour as completed - no user ID");
      return;
    }

    try {
      const userTourKey = `${TOUR_USER_PREFIX}${user.id}`;
      localStorage.setItem(userTourKey, "true");
      localStorage.setItem(TOUR_COMPLETED_KEY, "true"); // Backward compatibility
      setIsFirstTime(false);
      // eslint-disable-next-line no-console
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("❌ Erro ao marcar tour como completo:", error);
    }
  };

  const resetTour = () => {
    if (!user?.id) return;

    try {
      const userTourKey = `${TOUR_USER_PREFIX}${user.id}`;
      localStorage.removeItem(userTourKey);
      localStorage.removeItem(TOUR_COMPLETED_KEY);
      setIsFirstTime(true);
    } catch (error) {
      // console.warn("Erro ao resetar tour:", error);
    }
  };

  return {
    isFirstTime,
    isLoading,
    markTourAsCompleted,
    resetTour,
  };
};
