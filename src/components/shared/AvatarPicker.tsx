/* eslint-disable @next/next/no-img-element */
"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TRAINERS } from "@/utils/trainers";

interface AvatarPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedId: string;
  onSelect: (id: string) => void;
}

export const AvatarPicker = ({ open, onOpenChange, selectedId, onSelect }: AvatarPickerProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border/50 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display">Escolha seu avatar</DialogTitle>
          <DialogDescription>Selecione um treinador da franquia Pokémon.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-2">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {TRAINERS.map((t) => {
              const active = t.id === selectedId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onSelect(t.id)}
                  className={`rounded-xl border-2 p-2 flex flex-col items-center gap-1 transition-all hover:scale-105 ${active ? "border-primary bg-primary/10 shadow-lg shadow-primary/20" : "border-border/40 bg-background/40"
                    }`}
                >
                  <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-background to-muted rounded-lg overflow-hidden">
                    <img src={t.url} alt={t.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <span className="font-display text-xs tracking-wide">{t.name}</span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
