/* eslint-disable @next/next/no-img-element */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { IBattlePokemon } from "@/types/IBattle";
import { artwork } from "@/utils/sprites";

interface PokemonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pokemons: IBattlePokemon[];
  activeBattlePokemonId: string | null;
  locked?: boolean;
  onSelect: (battlePokemonId: string) => void;
}

export function PokemonModal({
  open,
  onOpenChange,
  pokemons,
  activeBattlePokemonId,
  locked,
  onSelect,
}: PokemonModalProps) {
  return (
    <Dialog open={open} onOpenChange={locked ? () => {} : onOpenChange}>
      <DialogContent
        className="bg-card border-border/50 max-w-xl"
        showCloseButton={!locked}
        onInteractOutside={(e) => locked && e.preventDefault()}
        onEscapeKeyDown={(e) => locked && e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="font-display tracking-wider">Seu Time</DialogTitle>
          <DialogDescription>
            {locked
              ? "Seu Pokémon desmaiou — escolha outro para continuar."
              : "Escolha um Pokémon para entrar em batalha."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {pokemons.map((p) => {
            const isActive = p.id === activeBattlePokemonId;
            const disabled = isActive || p.fainted;
            const name = p.myPokemon.nickname || p.myPokemon.pokemon.name;
            return (
              <button
                key={p.id}
                disabled={disabled}
                onClick={() => onSelect(p.id)}
                className={`w-full flex items-center gap-3 rounded-lg border-2 p-3 transition-colors ${
                  isActive
                    ? "border-primary bg-primary/10"
                    : p.fainted
                    ? "border-border/30 opacity-50 cursor-not-allowed"
                    : "border-border/50 hover:border-primary/60 hover:bg-card/60"
                }`}
              >
                <img
                  src={artwork(p.myPokemon.pokemon.pokeId)}
                  alt={name}
                  className={`w-16 h-16 object-contain shrink-0 ${p.fainted ? "grayscale opacity-50" : ""}`}
                />
                <div className="flex-1 text-left space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm font-bold capitalize">{name}</span>
                    <span className="font-display text-[10px] text-muted-foreground">Lv.50</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-primary">HP</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${p.fainted ? "bg-muted-foreground/40" : "bg-green-500"}`}
                        style={{ width: `${(p.currentHp / p.maxHp) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-body text-muted-foreground">
                      {p.currentHp}/{p.maxHp}
                    </span>
                  </div>
                  {p.fainted && (
                    <span className="text-[9px] text-destructive font-display tracking-widest">DESMAIADO</span>
                  )}
                  {isActive && !p.fainted && (
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
