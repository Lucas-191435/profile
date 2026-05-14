/* eslint-disable @next/next/no-img-element */
import { IMyPokemon } from "@/types/IMyPokemon";
import { Badge } from "@/components/ui/badge";
import { Edit, Swords, XSquare } from "lucide-react"
import typeColors from "@/utils/typesColors";
import { Button } from "@/components/ui/button";
import { useState } from "react";


type PokemonMoveListProps = {
  selectedPokemon: IMyPokemon;
  isEditMove: boolean;
  isEditTeam: boolean;
  setEditMove: (value: boolean) => void;
}
const PokemonMoveList = ({ selectedPokemon, isEditMove, isEditTeam, setEditMove }: PokemonMoveListProps) => {


  const handleEditMove = () => {
    setEditMove(true);
  }

  const handleCancelEditMove = () => {
    setEditMove(false);
  }

  const handleSubmitEditMove = () => {
    setEditMove(false);
  }
  console.log("Selected Pokemon for Move List:", selectedPokemon);
  return (
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
        <div className="ml-auto flex flex-col items-end  gap-2">
          <div className="flex items-center gap-1">
            <Swords className="w-5 h-5 text-primary ml-auto" />
            <span className="font-display text-xs text-muted-foreground">Movimentos</span>
          </div>

          {!isEditMove &&
            <Button disabled={isEditTeam} size="sm" className="font-body glow-red" onClick={handleEditMove}>
              <Edit className="mr-2 h-4 w-4" /> Editar
            </Button>
          }

          {isEditMove && (
            <div className="flex row gap-2">
              <Button size="sm" className="font-body glow-red" onClick={handleCancelEditMove}>
                <XSquare className="mr-2 h-4 w-4" /> cancelar
              </Button>
              <Button size="sm" className="font-body glow-green bg-grass hover:bg-grass/70 cursor-pointer" onClick={handleSubmitEditMove}>
                <Edit className="mr-2 h-4 w-4" /> salvar
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Array.from({ length: 4 }).map((_, mIdx) => {
                      const moveName = selectedSlot.moves[mIdx] || null;
                      const moveData = moveName
                        ? allMoves.find((m) => m.name === moveName)
                        : null;
                      return (
                        <button
                          key={mIdx}
                          onClick={() => {
                            setEditMoveIdx(mIdx);
                            setMoveDialogOpen(true);
                          }}
                          className={`rounded-lg border p-3 text-left transition-all hover:border-primary/50 ${
                            moveName
                              ? "border-border/50 bg-background/50"
                              : "border-dashed border-border/30 bg-background/20"
                          }`}
                        >
                          {moveName ? (
                            <>
                              <span className="font-body text-xs font-semibold block">{moveName}</span>
                              {moveData && (
                                <div className="flex items-center gap-1 mt-1">
                                  <span className={`${typeColors[moveData.type]} w-2 h-2 rounded-full`} />
                                  <span className="text-[10px] text-muted-foreground uppercase">{moveData.type}</span>
                                </div>
                              )}
                            </>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">Slot {mIdx + 1}</span>
                          )}
                        </button>
                      );
                    })}
                  </div> */}
    </div>
  )
}

export default PokemonMoveList;