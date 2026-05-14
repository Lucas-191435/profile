/* eslint-disable @next/next/no-img-element */
import { IMyPokemon } from "@/types/IMyPokemon";
import { Badge } from "@/components/ui/badge";
import { Edit, Swords, XSquare } from "lucide-react"
import typeColors from "@/utils/typesColors";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { usePokeMove } from "@/services/queries/usePokeMove";
import { useMyPokemonContext } from "@/context/MyPokemonContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUpdatePokemonMoves } from "@/services/queries/useMyPokemon";

const MAX_MOVES = 4;

type PokemonMoveListProps = {
  selectedPokemon: IMyPokemon;
  isEditMove: boolean;
  isEditTeam: boolean;
  setEditMove: (value: boolean) => void;
}

const PokemonMoveList = ({ selectedPokemon, isEditMove, isEditTeam, setEditMove }: PokemonMoveListProps) => {
  const { teamSelected } = useMyPokemonContext();

  const teamKey = `${teamSelected}Move` as keyof IMyPokemon;
  const savedMoves = Array.isArray(selectedPokemon[teamKey]) ? selectedPokemon[teamKey] as string[] : [];

  const [localMoves, setLocalMoves] = useState<(string | null)[]>(() =>
    Array.from({ length: MAX_MOVES }, (_, i) => savedMoves[i] ?? null)
  );
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [editMoveIdx, setEditMoveIdx] = useState<number | null>(null);
  const [lastSyncKey, setLastSyncKey] = useState(`${selectedPokemon.id}-${teamSelected}`);

  // Reseta localMoves quando o pokemon ou time selecionado mudar (padrão de derived state)
  const syncKey = `${selectedPokemon.id}-${teamSelected}`;
  if (syncKey !== lastSyncKey) {
    setLastSyncKey(syncKey);
    setLocalMoves(Array.from({ length: MAX_MOVES }, (_, i) => savedMoves[i] ?? null));
  }

  // Fetch moves quando houver movimentos salvos OU quando estiver em modo de edição
  const shouldFetch = isEditMove || savedMoves.length > 0;
  const { data: pokemonMoves, isLoading } = usePokeMove({
    number: selectedPokemon.pokemon.pokeId,
    enabled: shouldFetch,
  });

  const updateMoves = useUpdatePokemonMoves();

  const handleEditMove = () => setEditMove(true);

  const handleCancelEditMove = () => {
    // Reverte alterações locais
    setLocalMoves(Array.from({ length: MAX_MOVES }, (_, i) => savedMoves[i] ?? null));
    setEditMove(false);
  };

  const handleSubmitEditMove = () => {
    updateMoves.mutate({
      myPokemonId: selectedPokemon.id,
      teamName: teamSelected,
      moves: localMoves.filter(Boolean) as string[],
    });
    setEditMove(false);
  };

  const handleSelectMove = (moveId: string) => {
    if (editMoveIdx === null) return;
    setLocalMoves(prev => {
      const next = [...prev];
      next[editMoveIdx] = moveId;
      return next;
    });
    setMoveDialogOpen(false);
  };

  const handleRemoveMove = (idx: number) => {
    setLocalMoves(prev => {
      const next = [...prev];
      next[idx] = null;
      return next;
    });
  };

  return (
    <>
      <div className="mt-6 p-4 rounded-xl border border-primary/30 bg-card/80">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={selectedPokemon.pokemon.img1}
            alt={selectedPokemon.pokemon.name}
            className="w-12 h-12 object-contain"
          />
          <div>
            <h3 className="font-display font-bold text-sm">{selectedPokemon.pokemon.name}</h3>
            <div className="flex gap-1">
              {JSON.parse(selectedPokemon.pokemon.types).map((t: string) => (
                <Badge key={t} className={`${typeColors[t]} text-[10px] uppercase`}>{t}</Badge>
              ))}
            </div>
          </div>
          <div className="ml-auto flex flex-col items-end gap-2">
            <div className="flex items-center gap-1">
              <Swords className="w-5 h-5 text-primary ml-auto" />
              <span className="font-display text-xs text-muted-foreground">Movimentos</span>
            </div>

            {!isEditMove && (
              <Button disabled={isEditTeam} size="sm" className="font-body glow-red" onClick={handleEditMove}>
                <Edit className="mr-2 h-4 w-4" /> Editar
              </Button>
            )}

            {isEditMove && (
              <div className="flex row gap-2">
                <Button size="sm" className="font-body glow-red" onClick={handleCancelEditMove}>
                  <XSquare className="mr-2 h-4 w-4" /> Cancelar
                </Button>
                <Button
                  size="sm"
                  className="font-body glow-green bg-grass hover:bg-grass/70 cursor-pointer"
                  onClick={handleSubmitEditMove}
                  disabled={updateMoves.isPending}
                >
                  <Edit className="mr-2 h-4 w-4" /> Salvar
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Array.from({ length: MAX_MOVES }).map((_, mIdx) => {
            const moveId = localMoves[mIdx];
            const moveData = moveId ? pokemonMoves?.find((m) => m.id === moveId) : null;

            return (
              <button
                key={mIdx}
                disabled={!isEditMove}
                onClick={() => {
                  setEditMoveIdx(mIdx);
                  setMoveDialogOpen(true);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  if (isEditMove && moveId) handleRemoveMove(mIdx);
                }}
                className={`rounded-lg border p-3 text-left transition-all ${
                  isEditMove ? "hover:border-primary/50 cursor-pointer" : "cursor-default"
                } ${
                  moveData
                    ? "border-border/50 bg-background/50"
                    : "border-dashed border-border/30 bg-background/20"
                }`}
              >
                {moveData ? (
                  <>
                    <span className="font-body text-xs font-semibold block truncate">{moveData.name}</span>
                    <div className="flex items-center gap-1 mt-1">
                      {moveData.type && (
                        <span className={`${typeColors[moveData.type]} w-2 h-2 rounded-full shrink-0`} />
                      )}
                      <span className="text-[10px] text-muted-foreground uppercase truncate">{moveData.type ?? "—"}</span>
                    </div>
                  </>
                ) : isLoading && shouldFetch ? (
                  <span className="text-[10px] text-muted-foreground">...</span>
                ) : (
                  <span className="text-[10px] text-muted-foreground">
                    {isEditMove ? `+ Slot ${mIdx + 1}` : `Slot ${mIdx + 1}`}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <Dialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen}>
        <DialogContent className="bg-card border-border/50 max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Escolher Movimento</DialogTitle>
            <DialogDescription>
              {selectedPokemon.pokemon.name} — Slot {(editMoveIdx ?? 0) + 1}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] pr-2">
            <div className="space-y-1">
              {isLoading && (
                <p className="text-xs text-muted-foreground text-center py-4">Carregando movimentos...</p>
              )}
              {pokemonMoves?.map((m) => {
                const isSelectedInOtherSlot = localMoves.some((id, i) => id === m.id && i !== editMoveIdx);
                const isThisSlot = localMoves[editMoveIdx ?? -1] === m.id;

                return (
                  <button
                    key={m.id}
                    disabled={isSelectedInOtherSlot}
                    onClick={() => handleSelectMove(m.id)}
                    className={`w-full text-left rounded-lg border p-2 flex items-center gap-2 transition-all ${
                      isThisSlot
                        ? "border-primary bg-primary/10"
                        : isSelectedInOtherSlot
                        ? "opacity-30 cursor-not-allowed border-border/20"
                        : "border-border/30 hover:border-primary/40 bg-background/30"
                    }`}
                  >
                    {m.type && (
                      <span className={`${typeColors[m.type]} w-3 h-3 rounded-full shrink-0`} />
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="font-body text-xs font-semibold block">{m.name}</span>
                      {m.description && (
                        <span className="text-[10px] text-muted-foreground line-clamp-1">{m.description}</span>
                      )}
                    </div>
                    {m.type && (
                      <Badge variant="outline" className="text-[9px] uppercase shrink-0">{m.type}</Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PokemonMoveList;