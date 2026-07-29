/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Team } from "@/types/IMyPokemon";
import { TeamName } from "@/types/IBattle";
import { Swords, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { artwork } from "@/utils/sprites";
import typeColors from "@/utils/typesColors";
import { useMyPokemon } from "@/services/queries/useMyPokemon";
import { useCreateBattle } from "@/services/queries/useBattle";
import Link from "next/link";

type TeamWithName = Team & { teamName: TeamName };

export function BattleButton() {
  const { data: pokemonList, isLoading, error } = useMyPokemon({ enabled: true });
  const router = useRouter();
  const createBattle = useCreateBattle();
  const [open, setOpen] = useState(false);
  const [warnOpen, setWarnOpen] = useState(false);
  const [teams, setTeams] = useState<TeamWithName[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);



  useEffect(() => {
        if (pokemonList) {
            const teamApha = pokemonList?.filter((p) => p.teamAlpha === true).map((p) => p.id) || [];
            const teamBeta = pokemonList?.filter((p) => p.teamBeta === true).map((p) => p.id) || [];
            const teamGamma = pokemonList?.filter((p) => p.teamGamma === true).map((p) => p.id) || [];
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTeams([
                {
                    name: "Time Alpha",
                    teamName: "teamAlpha",
                    slots: [
                        ...teamApha.map((id) => ({ pokemonId: id, moves: [] })),
                        ...Array(6 - teamApha.length).fill({ pokemonId: null, moves: [] })
                    ],
                },
                {
                    name: "Time Beta",
                    teamName: "teamBeta",
                    slots: [
                        ...teamBeta.map((id) => ({ pokemonId: id, moves: [] })),
                        ...Array(6 - teamBeta.length).fill({ pokemonId: null, moves: [] })
                    ],
                },
                {
                    name: "Time Gamma",
                    teamName: "teamGamma",
                    slots: [
                        ...teamGamma.map((id) => ({ pokemonId: id, moves: [] })),
                        ...Array(6 - teamGamma.length).fill({ pokemonId: null, moves: [] })
                    ],
                },
            ]);
        }
    }, [pokemonList]);

  const handleConfirmBattle = async () => {
    if (selectedIdx === null) return;
    const team = teams[selectedIdx];
    const { id } = await createBattle.mutateAsync({ teamName: team.teamName });
    setOpen(false);
    router.push(`/battle/${id}`);
  };

  const handleClick = () => {

    const hasAny = teams.some((t) => t.slots.some((s) => s.pokemonId !== null));
    if (!hasAny) {
      setWarnOpen(true);
    } else {
      setSelectedIdx(null);
      setOpen(true);
    }
  };

  const getPokemon = (id: string) => pokemonList?.find((p) => p.id === id);

  return (
    <>
      <Button
        onClick={handleClick}
        size="sm"
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-display tracking-wider gap-2 glow-red"
      >
        <Swords className="w-4 h-4" />
        Batalha
      </Button>

      {/* Warning: no team */}
      <Dialog open={warnOpen} onOpenChange={setWarnOpen}>
        <DialogContent className="bg-card border-border/50 max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              Nenhum time montado
            </DialogTitle>
            <DialogDescription>
              Você precisa montar pelo menos um time (Alpha, Beta ou Gamma) antes de batalhar.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWarnOpen(false)}>
              Cancelar
            </Button>
            <Link
              href="/meu-pokemon"
              onClick={() => {
                setWarnOpen(false);
              }}
              className="bg-primary hover:bg-primary/90"
            >
              Montar time
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Team selection */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border/50 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Swords className="w-5 h-5 text-primary" />
              Escolha um time para batalhar
            </DialogTitle>
            <DialogDescription>
              Selecione um dos times abaixo para entrar em batalha.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            {teams.map((team, tIdx) => {
              const filled = team.slots.filter((s) => s.pokemonId !== null);
              const isEmpty = filled.length === 0;
              const isSelected = selectedIdx === tIdx;
              return (
                <button
                  key={tIdx}
                  disabled={isEmpty}
                  onClick={() => setSelectedIdx(tIdx)}
                  className={`w-full rounded-xl border-2 p-3 text-left transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 glow-red"
                      : isEmpty
                      ? "border-dashed border-border/30 bg-card/30 opacity-50 cursor-not-allowed"
                      : "border-border/50 bg-background/40 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display text-sm font-bold tracking-wider">
                      {team.name}
                    </span>
                    <span className="font-body text-xs text-muted-foreground">
                      {filled.length}/6 Pokémon
                    </span>
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {team.slots.map((slot, sIdx) => {
                      const p = slot.pokemonId ? getPokemon(slot.pokemonId) : null;
                      return (
                        <div
                          key={sIdx}
                          className={`aspect-square rounded-lg border flex flex-col items-center justify-center p-1 ${
                            p
                              ? "border-border/50 bg-card"
                              : "border-dashed border-border/20 bg-card/20"
                          }`}
                        >
                          {p ? (
                            <>
                              <img
                                src={artwork(p.pokemon.pokeId)}
                                alt={p.pokemon.name || ''}
                                className="w-full h-8 object-contain"
                              />
                              <span className="text-[9px] font-body truncate w-full text-center">
                                {p.nickname}
                              </span>
                              <div className="flex gap-0.5 mt-0.5">
                                {p.pokemon.types.split(',').map((t: any) => (
                                  <span
                                    key={t}
                                    className={`${typeColors[t]} w-1.5 h-1.5 rounded-full`}
                                  />
                                ))}
                              </div>
                            </>
                          ) : (
                            <span className="text-[9px] text-muted-foreground">—</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </button>
              );
            })}
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Link
              href="/meu-pokemon"
              className="border-1 m-2 p-1 rounded-sm cursor-pointer"
              onClick={() => {
                setOpen(false);
              }}
            >
              Mudar time
            </Link>
            <Button
              onClick={handleConfirmBattle}
              disabled={selectedIdx === null || createBattle.isPending}
              className="bg-primary hover:bg-primary/90 glow-red"
            >
              <Swords className="w-4 h-4 mr-2" />
              {createBattle.isPending ? "Criando batalha..." : "Ir pra batalha"}
            </Button>

          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
