/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Team } from "@/types/IMyPokemon";
import { TeamName } from "@/types/IBattle";
import { Swords, AlertTriangle, LogIn, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useCreateBattle, useListBattle } from "@/services/queries/useBattle";
import type { BattleStatus } from "@/types/IBattle";
import Link from "next/link";

type TeamWithName = Team & { teamName: TeamName };

type Step = "choice" | "join" | "team";

const battleStatusLabels: Record<BattleStatus, string> = {
  WAITING_OPPONENT: "Aguardando oponente",
  SELECTING_LEAD: "Selecionando líder",
  IN_PROGRESS: "Em andamento",
  FINISHED: "Finalizada",
};

/** Aceita tanto a URL completa do convite (ex.: http://host/battle/<id>) quanto só o id colado. */
function extractBattleId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const pathMatch = trimmed.match(/\/battle\/([^/?#]+)/);
  if (pathMatch) return pathMatch[1];
  return trimmed;
}

export function BattleButton() {
  const { data: pokemonList, isLoading, error } = useMyPokemon({ enabled: true });
  const router = useRouter();
  const createBattle = useCreateBattle();
  const [open, setOpen] = useState(false);
  const [warnOpen, setWarnOpen] = useState(false);
  const [teams, setTeams] = useState<TeamWithName[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [step, setStep] = useState<Step>("choice");
  const [joinUrl, setJoinUrl] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);

  const { data: battleRooms, isLoading: isLoadingBattleRooms } = useListBattle({
    enabled: open && step === "join",
  });

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
    setStep("choice");
    setSelectedIdx(null);
    setJoinUrl("");
    setJoinError(null);
    setOpen(true);
  };

  const handleChooseCreate = () => {
    const hasAny = teams.some((t) => t.slots.some((s) => s.pokemonId !== null));
    if (!hasAny) {
      setOpen(false);
      setWarnOpen(true);
    } else {
      setSelectedIdx(null);
      setStep("team");
    }
  };

  const handleJoinRoom = (roomId?: string) => {
    const id = roomId ?? extractBattleId(joinUrl);
    if (!id) {
      setJoinError("Cole o link do convite da sala.");
      return;
    }
    setOpen(false);
    router.push(`/battle/${id}`);
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

      {/* Fluxo de batalha: escolher entrar em sala ou criar batalha */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={step === "team" ? "bg-card border-border/50 max-w-2xl" : "bg-card border-border/50 max-w-md"}>
          {step === "choice" && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display flex items-center gap-2">
                  <Swords className="w-5 h-5 text-primary" />
                  Batalha
                </DialogTitle>
                <DialogDescription>
                  Entre numa sala que te convidaram ou crie uma nova batalha.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setStep("join")}
                  className="w-full rounded-xl border-2 border-border/50 bg-background/40 hover:border-primary/50 p-4 text-left transition-all flex items-center gap-3"
                >
                  <LogIn className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <span className="font-display text-sm font-bold tracking-wider block">
                      Entrar em uma sala
                    </span>
                    <span className="font-body text-xs text-muted-foreground">
                      Cole o link do convite de uma batalha existente.
                    </span>
                  </div>
                </button>

                <button
                  onClick={handleChooseCreate}
                  className="w-full rounded-xl border-2 border-border/50 bg-background/40 hover:border-primary/50 p-4 text-left transition-all flex items-center gap-3"
                >
                  <Swords className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <span className="font-display text-sm font-bold tracking-wider block">
                      Criar batalha
                    </span>
                    <span className="font-body text-xs text-muted-foreground">
                      Escolha um dos seus times e gere uma nova sala.
                    </span>
                  </div>
                </button>
              </div>
            </>
          )}

          {step === "join" && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display flex items-center gap-2">
                  <LogIn className="w-5 h-5 text-primary" />
                  Entrar em uma sala
                </DialogTitle>
                <DialogDescription>
                  Cole abaixo o link do convite que você recebeu.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-2">
                <Input
                  autoFocus
                  placeholder="https://.../battle/xxxxxxxx"
                  value={joinUrl}
                  onChange={(e) => {
                    setJoinUrl(e.target.value);
                    setJoinError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleJoinRoom();
                  }}
                />
                {joinError && (
                  <span className="font-body text-xs text-destructive">{joinError}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-display text-xs font-bold tracking-wider text-muted-foreground">
                  Ou escolha uma sala aberta
                </span>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                  {isLoadingBattleRooms && (
                    <span className="font-body text-xs text-muted-foreground">Carregando salas...</span>
                  )}
                  {!isLoadingBattleRooms && (!battleRooms || battleRooms.battles.length === 0) && (
                    <span className="font-body text-xs text-muted-foreground">Nenhuma sala aberta no momento.</span>
                  )}
                  {battleRooms?.battles.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => handleJoinRoom(room.id)}
                      className="w-full rounded-lg border border-border/50 bg-background/40 hover:border-primary/50 p-2.5 text-left transition-all flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <span className="font-display text-xs font-bold tracking-wider block truncate">
                          {room.playerA.name || room.playerA.email}
                        </span>
                        <span className="font-body text-[12px] text-muted-foreground">
                          {battleStatusLabels[room.status]}
                        </span>
                        <span className="font-display text-[10px] font-bold tracking-wider block truncate">
                          {new Date(room.createdAt).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <LogIn className="w-4 h-4 text-primary shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-2">
                <Button variant="outline" onClick={() => setStep("choice")}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                </Button>
                <Button
                  onClick={() => handleJoinRoom()}
                  disabled={!joinUrl.trim()}
                  className="bg-primary hover:bg-primary/90 glow-red"
                >
                  <LogIn className="w-4 h-4 mr-2" /> Entrar
                </Button>
              </DialogFooter>
            </>
          )}

          {step === "team" && (
          <>
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
            <Button variant="outline" onClick={() => setStep("choice")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>

            <Button
              onClick={handleConfirmBattle}
              disabled={selectedIdx === null || createBattle.isPending}
              className="bg-primary hover:bg-primary/90 glow-red"
            >
              <Swords className="w-4 h-4 mr-2" />
              {createBattle.isPending ? "Criando batalha..." : "Ir pra batalha"}
            </Button>

          </DialogFooter>
          </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
