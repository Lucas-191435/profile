"use client";

import { useState, useCallback } from "react";
import { CallBackProps, STATUS, Step } from "react-joyride";
interface UseTourProps {
  steps: Step[];
  autoStart?: boolean;
  onTourComplete?: () => void;
}

export const useTour = ({
  steps,
  autoStart = false,
  onTourComplete,
}: UseTourProps) => {
  const [run, setRun] = useState(autoStart);
  const [stepIndex, setStepIndex] = useState(0);
  const [tourCompleted, setTourCompleted] = useState(false);

  const handleJoyrideCallback = useCallback(
    (data: CallBackProps) => {
      const { status, action, index, type, lifecycle } = data;
      // eslint-disable-next-line no-console
      // console.log("Joyride callback data:", data);
      // eslint-disable-next-line no-console
      // console.log("Action:", action, "Type:", type, "Lifecycle:", lifecycle, "Index:", index);

      if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
        // eslint-disable-next-line no-console
        console.log("🎯 Tour finished or skipped! Calling onTourComplete...");
        setRun(false);
        setTourCompleted(true);
        setStepIndex(0);
        // Chama callback quando tour é completado
        onTourComplete?.();
        // eslint-disable-next-line no-console
        console.log("✅ onTourComplete called successfully");
      } else if (action === "next" && lifecycle === "complete") {
        // Avança para o próximo passo
        // eslint-disable-next-line no-console
        // console.log("Advancing from step", index, "to", index + 1);
        if (index < steps.length - 1) {
          setStepIndex(index + 1);
        } else {
          // Chegamos ao final do tour
          // eslint-disable-next-line no-console
          console.log("🎯 Reached end of tour! Finishing...");
          setRun(false);
          setTourCompleted(true);
          setStepIndex(0);
          onTourComplete?.();
          // eslint-disable-next-line no-console
          console.log("✅ Tour completed successfully");
        }
      } else if (action === "prev" && lifecycle === "complete") {
        // Volta para o passo anterior
        // eslint-disable-next-line no-console
        // console.log("Going back from step", index, "to", index - 1);
        if (index > 0) {
          setStepIndex(index - 1);
        }
      }
    },
    [onTourComplete, steps.length],
  );

  const startTour = useCallback(() => {
    setRun(true);
    setStepIndex(0);
    setTourCompleted(false);
  }, []);

  const stopTour = useCallback(() => {
    setRun(false);
    setStepIndex(0);
  }, []);

  const resetTour = useCallback(() => {
    setRun(false);
    setStepIndex(0);
    setTourCompleted(false);
  }, []);

  return {
    run,
    stepIndex,
    tourCompleted,
    handleJoyrideCallback,
    startTour,
    stopTour,
    resetTour,
    steps,
  };
};
