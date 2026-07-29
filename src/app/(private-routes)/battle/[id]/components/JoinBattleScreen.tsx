'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Swords, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyPokemon } from "@/services/queries/useMyPokemon";
import { TeamName } from "@/types/IBattle";
import { errorToast } from "@/utils/toasts";

const TEAM_OPTIONS: { teamName: TeamName; label: string }[] = [
  { teamName: "teamAlpha", label: "Alpha" },
  { teamName: "teamBeta", label: "Beta" },
  { teamName: "teamGamma", label: "Gamma" },
];

interface JoinBattleScreenProps {
  onJoin: (teamName: TeamName) => Promise<void>;
}

export function JoinBattleScreen({ onJoin }: JoinBattleScreenProps) {
  const router = useRouter();
  const { data: pokemons, isLoading } = useMyPokemon({ enabled: true });
  const [selected, setSelected] = useState<TeamName | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  const teamCounts: Record<TeamName, number> = {
    teamAlpha: pokemons?.filter((p) => p.teamAlpha).length ?? 0,
    teamBeta: pokemons?.filter((p) => p.teamBeta).length ?? 0,
    teamGamma: pokemons?.filter((p) => p.teamGamma).length ?? 0,
  };

  const handleJoin = async () => {
    if (!selected) return;
    setIsJoining(true);
    try {
      await onJoin(selected);
    } catch (err) {
      errorToast({ description: err instanceof Error ? err.message : "Erro ao entrar na batalha." });
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="max-w-md mx-auto space-y-6">
        <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>

        <div className="text-center space-y-2">
          <h1 className="font-display text-2xl font-black tracking-wider text-glow">
            VOCÊ FOI DESAFIADO!
          </h1>
          <p className="font-body text-muted-foreground text-sm">
            Escolha qual time vai representar você nesta batalha.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {TEAM_OPTIONS.map(({ teamName, label }) => {
            const count = teamCounts[teamName];
            const isEmpty = count === 0;
            const isSelected = selected === teamName;
            return (
              <button
                key={teamName}
                disabled={isEmpty}
                onClick={() => setSelected(teamName)}
                className={`w-full rounded-xl border-2 p-4 text-left transition-all font-display tracking-wider ${
                  isSelected
                    ? "border-primary bg-primary/10 glow-red"
                    : isEmpty
                    ? "border-dashed border-border/30 bg-card/30 opacity-50 cursor-not-allowed"
                    : "border-border/50 bg-card hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Time {label}</span>
                  <span className="text-xs font-body text-muted-foreground">{count}/6 Pokémon</span>
                </div>
              </button>
            );
          })}
        </div>

        <Button
          size="lg"
          disabled={!selected || isJoining}
          onClick={handleJoin}
          className="w-full bg-primary hover:bg-primary/90 glow-red font-display tracking-wider"
        >
          <Swords className="w-4 h-4 mr-2" /> {isJoining ? "Entrando..." : "Entrar na batalha"}
        </Button>
      </div>
    </div>
  );
}
