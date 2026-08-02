/* eslint-disable @next/next/no-img-element */
import { Swords, Check, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IBattlePokemon } from "@/types/IBattle";
import { artwork } from "@/utils/sprites";
import typeColors from "@/utils/typesColors";

interface PokemonSelectScreenProps {
  teamLabel: string;
  pokemons: IBattlePokemon[];
  selectedBattlePokemonId: string | null;
  onSelectLead: (battlePokemonId: string) => void;
  isReady: boolean;
  opponentReady: boolean;
  onReady: () => void;
  onBack: () => void;
}

export function PokemonSelectScreen({
  teamLabel,
  pokemons,
  selectedBattlePokemonId,
  onSelectLead,
  isReady,
  opponentReady,
  onReady,
  onBack,
}: PokemonSelectScreenProps) {
  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
          <span className="font-display tracking-widest text-xs text-muted-foreground">
            TIME {teamLabel.toUpperCase()}
          </span>
        </div>

        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl font-black tracking-wider text-glow">
            ESCOLHA SEU POKÉMON
          </h1>
          <p className="font-body text-muted-foreground">
            Selecione qual Pokémon iniciará a batalha.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {pokemons.map((p) => {
            const isSelected = selectedBattlePokemonId === p.id;
            const disabled = isReady;
            return (
              <button
                key={p.id}
                disabled={disabled}
                onClick={() => onSelectLead(p.id)}
                className={`relative rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 glow-red scale-105"
                    : disabled
                    ? "border-border/30 bg-card/30 opacity-60 cursor-not-allowed"
                    : "border-border/50 bg-card hover:border-primary/50"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                <img
                  src={artwork(p.myPokemon.pokemon.pokeId)}
                  alt={p.myPokemon.pokemon.name}
                  className="w-24 h-24 object-contain"
                />
                <span className="font-display text-sm font-bold capitalize">
                  {p.myPokemon.nickname || p.myPokemon.pokemon.name}
                </span>
                <div className="flex gap-1">
                  {p.myPokemon.pokemon.types.split(",").map((t) => (
                    <span
                      key={t}
                      className={`${typeColors[t]} text-[9px] uppercase px-2 py-0.5 rounded-full text-white`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-3 pt-4">
          <label className="flex items-center gap-2 font-body text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={isReady}
              onChange={() => {
                if (!isReady) onReady();
              }}
              disabled={!selectedBattlePokemonId || isReady}
              className="w-4 h-4 accent-primary"
            />
            Estou pronto para batalhar
          </label>
          {isReady && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="font-body text-xs">
                {opponentReady ? "Iniciando batalha..." : "Aguardando o oponente ficar pronto..."}
              </span>
            </div>
          )}
          {!isReady && (
            <Button
              size="lg"
              disabled={!selectedBattlePokemonId}
              onClick={onReady}
              className="bg-primary hover:bg-primary/90 glow-red font-display tracking-wider"
            >
              <Swords className="w-4 h-4 mr-2" /> Estou pronto
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
