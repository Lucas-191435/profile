"use client";

import React from "react";
import {Joyride} from "react-joyride";
import { useTour } from "@/hooks/useTour";
import { useFirstTimeUser } from "@/hooks/useFirstTimeUser";
import { tourSteps, tourConfig, mobileTourSteps } from "@/constants/tourSteps";
// Importar utilitários para desenvolvimento (expõe funções globais)
import "@/utils/tourUtils";
import { useIsMobile } from "@/hooks/useMobile";

interface TourGuideProps {
  autoStart?: boolean;
}

export const TourGuide: React.FC<TourGuideProps> = ({ autoStart = true }) => {
  const [mounted, setMounted] = React.useState(false);
  const {
    isFirstTime,
    isLoading,
    markTourAsCompleted,
    resetTour: resetFirstTime,
  } = useFirstTimeUser();

  const isMobile = useIsMobile();
  const {
    run,
    stepIndex,
    handleJoyrideCallback,
    startTour,
    stopTour,
    resetTour,
    steps,
  } = useTour({
    steps: isMobile ? mobileTourSteps : tourSteps,
    autoStart: false, // Sempre false aqui, controlamos via isFirstTime
    onTourComplete: markTourAsCompleted,
  });

  // Ensure component only renders on client to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-start logic para primeiro acesso
  React.useEffect(() => {
    if (mounted && !isLoading && isFirstTime && !run) {
      // Delay pequeno para garantir que a página carregou
      const timer = setTimeout(() => {
        startTour();
      }, 1500); // 1.5 segundos após carregar

      return () => clearTimeout(timer);
    }
  }, [mounted, isFirstTime, isLoading, run, startTour]);

  // Expor funções globalmente para controle externo
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).startTour = startTour;
      (window as any).stopTour = stopTour;
      (window as any).resetTour = () => {
        resetTour();
        resetFirstTime();
      };
    }
  }, [startTour, stopTour, resetTour, resetFirstTime]);

  // Don't render Joyride on server to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <>
      <Joyride
        onEvent={handleJoyrideCallback}
        continuous={tourConfig.continuous}
        options={{ 
          buttons: ['skip', 'primary', 'close', 'back'], 
          showProgress: true,
          overlayClickAction: 'next',
          dismissKeyAction: 'close',
          blockTargetInteraction: true,
        }}
        run={run}
        scrollToFirstStep={tourConfig.scrollToFirstStep}
        stepIndex={stepIndex}
        steps={steps}
        styles={tourConfig.styles}
        locale={tourConfig.locale}
      />

      {/* Botão para re-iniciar o tour (apenas para usuários que já completaram) */}
      {!isFirstTime && !isLoading && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 9999,
            display: "none", // botão ocultado
          }}
        >
          <button
            onClick={() => {
              startTour();
            }}
            style={{
              backgroundColor: "#1d6ee7",
              color: "white",
              padding: "8px",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            title="Repetir tour guiado"
          >
            ?
          </button>
        </div>
      )}
    </>
  );
};
