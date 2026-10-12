"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { EVENTS, EventData, Joyride, STATUS, Step } from "react-joyride";
import { useSession } from "next-auth/react";
import { useIsMobile } from "@/hooks/useMobile";
import { useIsTestUser } from "@/hooks/useIsTestUser";
import {
  globalTour,
  tourLocale,
  tourOptions,
  tourStyles,
  TourDefinition,
} from "@/constants/tours";
import { exposeTourDevTools, tourStorageKey } from "@/utils/tourUtils";

const GLOBAL_START_DELAY = 1500;
const PAGE_START_DELAY = 600;

type RegisteredPageTour = { tour: TourDefinition; ready: boolean };
type ActiveTour = { id: string; steps: Step[]; runKey: number };

type TourContextValue = {
  pageTour: TourDefinition | null;
  isRunning: boolean;
  startGlobalTour: () => void;
  startPageTour: () => void;
  registerPageTour: (tour: TourDefinition, ready: boolean) => void;
  unregisterPageTour: (id: string) => void;
};

const TourContext = createContext<TourContextValue | null>(null);

const readSeen = (key: string) => {
  try {
    return localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
};

const writeSeen = (key: string) => {
  try {
    localStorage.setItem(key, "true");
  } catch {
    // localStorage indisponível (aba anônima, bloqueado): o tour só volta a aparecer.
  }
};

export const TourProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const isMobile = useIsMobile();
  const isTestUser = useIsTestUser();

  const [registered, setRegistered] = useState<RegisteredPageTour | null>(null);
  const [active, setActive] = useState<ActiveTour | null>(null);
  // Incrementado a cada escrita no localStorage para reavaliar o que já foi visto.
  const [seenTick, setSeenTick] = useState(0);
  // true quando o global terminou (não pulado) e o tour da página deve encadear com a transição.
  const chainRef = useRef(false);

  useEffect(() => {
    exposeTourDevTools();
  }, []);

  const isSeen = useCallback(
    (tour: TourDefinition) => (userId ? readSeen(tourStorageKey(tour, userId)) : true),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userId, seenTick],
  );

  const markSeen = useCallback(
    (tour: TourDefinition) => {
      if (!userId) return;
      writeSeen(tourStorageKey(tour, userId));
      setSeenTick((t) => t + 1);
    },
    [userId],
  );

  const buildSteps = useCallback(
    (tour: TourDefinition): Step[] =>
      tour.steps
        .filter(
          (s) =>
            !(s.desktopOnly && isMobile) &&
            !(s.mobileOnly && !isMobile) &&
            !(s.testOnly && !isTestUser),
        )
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(({ desktopOnly, mobileOnly, testOnly, ...step }) => ({
          placement: "auto",
          ...step,
        })),
    [isMobile, isTestUser],
  );

  const start = useCallback(
    (tour: TourDefinition, withIntro = false) => {
      const steps = buildSteps(tour);
      if (withIntro) {
        steps.unshift({
          target: "body",
          placement: "center",
          title: tour.title,
          content: "Agora um tour rápido pelas funcionalidades desta página.",
        });
      }
      setActive({ id: tour.id, steps, runKey: Date.now() });
    },
    [buildSteps],
  );

  const pageTour = registered?.tour ?? null;
  const pageReady = registered?.ready ?? false;

  // Início automático: global primeiro; o tour da página só depois do global visto.
  useEffect(() => {
    if (!userId || active) return;

    if (!isSeen(globalTour)) {
      const timer = setTimeout(() => start(globalTour), GLOBAL_START_DELAY);
      return () => clearTimeout(timer);
    }

    if (pageTour && pageReady && !isSeen(pageTour)) {
      const withIntro = chainRef.current;
      const timer = setTimeout(() => {
        chainRef.current = false;
        start(pageTour, withIntro);
      }, PAGE_START_DELAY);
      return () => clearTimeout(timer);
    }
  }, [userId, active, pageTour, pageReady, isSeen, start]);

  const handleEvent = useCallback(
    (data: EventData) => {
      if (data.type !== EVENTS.TOUR_END || !active) return;

      const finishedTour = active.id === globalTour.id ? globalTour : pageTour;
      if (finishedTour) markSeen(finishedTour);

      if (active.id === globalTour.id && pageTour) {
        if (data.status === STATUS.SKIPPED) {
          // Pulou o global: o tour desta página não encadeia agora.
          markSeen(pageTour);
        } else {
          chainRef.current = true;
        }
      }
      setActive(null);
    },
    [active, pageTour, markSeen],
  );

  const registerPageTour = useCallback((tour: TourDefinition, ready: boolean) => {
    setRegistered({ tour, ready });
  }, []);

  const unregisterPageTour = useCallback((id: string) => {
    setRegistered((current) => (current?.tour.id === id ? null : current));
    // Saiu da página no meio do tour dela: para sem marcar como visto.
    setActive((current) => (current?.id === id ? null : current));
    chainRef.current = false;
  }, []);

  const startGlobalTour = useCallback(() => start(globalTour), [start]);
  const startPageTour = useCallback(() => {
    if (pageTour) start(pageTour);
  }, [pageTour, start]);

  const value = useMemo(
    () => ({
      pageTour,
      isRunning: !!active,
      startGlobalTour,
      startPageTour,
      registerPageTour,
      unregisterPageTour,
    }),
    [pageTour, active, startGlobalTour, startPageTour, registerPageTour, unregisterPageTour],
  );

  return (
    <TourContext.Provider value={value}>
      {children}
      {active && (
        <Joyride
          key={active.runKey}
          run
          continuous
          scrollToFirstStep
          steps={active.steps}
          options={tourOptions}
          styles={tourStyles}
          locale={tourLocale}
          onEvent={handleEvent}
        />
      )}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour deve ser usado dentro de <TourProvider>");
  return ctx;
};

/**
 * Registra o tour da página atual. Ele inicia sozinho na primeira visita
 * (depois do tour global) assim que `ready` for true.
 */
export const usePageTour = (tour: TourDefinition, { ready = true }: { ready?: boolean } = {}) => {
  const { registerPageTour, unregisterPageTour } = useTour();

  useEffect(() => {
    registerPageTour(tour, ready);
  }, [tour, ready, registerPageTour]);

  useEffect(() => () => unregisterPageTour(tour.id), [tour.id, unregisterPageTour]);
};
