"use client";

import { useState } from "react";
import { Compass, Map, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTour } from "./TourProvider";

export const TourMenu = () => {
  const { pageTour, isRunning, startGlobalTour, startPageTour } = useTour();
  const [open, setOpen] = useState(false);

  const run = (startFn: () => void) => {
    setOpen(false);
    startFn();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className="size-10 shrink-0 p-0 has-[>svg]:px-0 border-1 rounded-md cursor-pointer"
          aria-label="Tour guiado"
          title="Tour guiado"
          disabled={isRunning}
          data-tour="btn-tour"
        >
          <Route className="size-5 text-white" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-1">
        {pageTour && (
          <button
            className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent cursor-pointer"
            onClick={() => run(startPageTour)}
          >
            <Compass className="w-4 h-4 text-primary" />
            Tour desta página
          </button>
        )}
        <button
          className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent cursor-pointer"
          onClick={() => run(startGlobalTour)}
        >
          <Map className="w-4 h-4 text-primary" />
          Tour geral
        </button>
      </PopoverContent>
    </Popover>
  );
};
