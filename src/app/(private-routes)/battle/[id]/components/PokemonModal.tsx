/* eslint-disable @next/next/no-img-element */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { IMyPokemon, TeamSlot } from "@/types/IMyPokemon";
import { artwork } from "@/utils/sprites";

interface PokemonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slots: TeamSlot[];
  getPokemon: (id: string | null) => IMyPokemon | null;
  selectedSlot: number | null;
  onSelect: (idx: number, pokemon: IMyPokemon) => void;
}

export function PokemonModal({ open, onOpenChange, slots, getPokemon, selectedSlot, onSelect }: PokemonModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border/50 max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display tracking-wider">Seu Time</DialogTitle>
          <DialogDescription>Escolha um Pokémon para entrar em batalha.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {slots.map((slot, idx) => {
            const p = getPokemon(slot.pokemonId);
            if (!p) return null;
            const isActive = idx === selectedSlot;
            return (
              <button
                key={idx}
                disabled={isActive}
                onClick={() => onSelect(idx, p)}
                className={`w-full flex items-center gap-3 rounded-lg border-2 p-3 transition-colors ${
                  isActive
                    ? "border-primary bg-primary/10"
                    : "border-border/50 hover:border-primary/60 hover:bg-card/60"
                }`}
              >
                <img
                  src={artwork(p.pokemon.pokeId)}
                  alt={p.pokemon.name}
                  className="w-16 h-16 object-contain shrink-0"
                />
                <div className="flex-1 text-left space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm font-bold capitalize">
                      {p.nickname || p.pokemon.name}
                    </span>
                    <span className="font-display text-[10px] text-muted-foreground">Lv.50</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-primary">HP</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "100%" }} />
                    </div>
                    <span className="text-[10px] font-body text-muted-foreground">100/100</span>
                  </div>
                  {isActive && (
                    <span className="text-[9px] text-primary font-display tracking-widest">EM CAMPO</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
