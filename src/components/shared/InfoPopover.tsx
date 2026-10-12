"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type InfoPopoverProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
  "data-tour"?: string;
};

// Ajuda pontual: abre com hover no desktop e com toque/clique no mobile.
export const InfoPopover = ({ title, children, className, ...props }: InfoPopoverProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={title ? `Ajuda: ${title}` : "Ajuda"}
          className={cn(
            "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary cursor-pointer",
            className,
          )}
          // Só ponteiro de mouse: no toque o clique já abre/fecha.
          onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
          data-tour={props["data-tour"]}
        >
          <Info className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 text-sm"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {title && <p className="font-semibold mb-1">{title}</p>}
        <div className="text-muted-foreground space-y-1">{children}</div>
      </PopoverContent>
    </Popover>
  );
};
