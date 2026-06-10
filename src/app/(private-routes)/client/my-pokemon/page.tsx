/* eslint-disable @next/next/no-img-element */
'use client';

import { Separator } from "@/components/ui/separator";
import { Users} from "lucide-react";
import ContainerSidebar from "@/components/shared/ContainerSidebar";

import { useMyPokemonContext } from "@/context/MyPokemonContext";
import MyCollection from "./ui/MyCollection";
import MyPokemonSkeleton from "./ui/MyPokemonSkeleton";

import TeamsPokemon from "./ui/TeamsPokemon";

const MyPokemonPage = () => {
  const {
    isLoading: contextLoading,
  } = useMyPokemonContext();

  if (contextLoading) {
    return <MyPokemonSkeleton />;
  }

  return (
    <ContainerSidebar className="p-4 lg:p-8 space-y-6">
      <h1 className="font-display text-2xl font-bold tracking-wide flex items-center gap-2">
        <Users className="w-6 h-6 text-primary" /> Meu Pokémon
      </h1>

      {/* Collection */}
      <MyCollection />

      <Separator className="bg-border/50" />

      {/* Teams */}
      <TeamsPokemon />

      {/* Move Selection Dialog */}
      {/* <Dialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen}>
        <DialogContent className="bg-card border-border/50 max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Escolher Movimento</DialogTitle>
            <DialogDescription>
              {selectedPokemon?.name} — Slot {(editMoveIdx ?? 0) + 1}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] pr-2">
            <div className="space-y-1">
              {allMoves.map((m) => {
                const isCurrentlySelected = selectedSlot?.moves.includes(m.name);
                const isThisSlot = selectedSlot?.moves[editMoveIdx ?? 0] === m.name;
                return (
                  <button
                    key={m.name}
                    disabled={isCurrentlySelected && !isThisSlot}
                    onClick={() => {
                      if (selectedSlotIdx !== null && editMoveIdx !== null) {
                        setSlotMove(selectedTeamIdx, selectedSlotIdx, editMoveIdx, m.name);
                        setMoveDialogOpen(false);
                      }
                    }}
                    className={`w-full text-left rounded-lg border p-2 flex items-center gap-2 transition-all ${
                      isThisSlot
                        ? "border-primary bg-primary/10"
                        : isCurrentlySelected
                        ? "opacity-30 cursor-not-allowed border-border/20"
                        : "border-border/30 hover:border-primary/40 bg-background/30"
                    }`}
                  >
                    <span className={`${typeColors[m.type]} w-3 h-3 rounded-full shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <span className="font-body text-xs font-semibold block">{m.name}</span>
                      <span className="text-[10px] text-muted-foreground">{m.source}</span>
                    </div>
                    <Badge variant="outline" className="text-[9px] uppercase shrink-0">{m.type}</Badge>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog> */}
    </ContainerSidebar>
  );
}

export default MyPokemonPage;