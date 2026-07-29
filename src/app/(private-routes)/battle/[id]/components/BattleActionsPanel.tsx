import { ArrowLeft, Backpack, MessageCircle, Swords, Users } from "lucide-react";
import { ActionButton } from "./ActionButton";
import { MenuView } from "./types";
import { IBattlePokemonMove } from "@/types/IBattle";

interface BattleActionsPanelProps {
  menuView: MenuView;
  moves: IBattlePokemonMove[];
  selectedMoveIdx: number | null;
  locked: boolean;
  onOpenAttacks: () => void;
  onOpenBag: () => void;
  onOpenPokemon: () => void;
  onOpenChat: () => void;
  onBackToMain: () => void;
  onUseMove: () => void;
}

export function BattleActionsPanel({
  menuView,
  moves,
  selectedMoveIdx,
  locked,
  onOpenAttacks,
  onOpenBag,
  onOpenPokemon,
  onOpenChat,
  onBackToMain,
  onUseMove,
}: BattleActionsPanelProps) {
  const selectedMove = selectedMoveIdx !== null ? moves[selectedMoveIdx] : null;
  const canUseSelectedMove =
    !!selectedMove && selectedMove.currentPp > 0 && selectedMove.move.power !== null;

  return (
    <div className="bg-[#f8f8f8] border-4 border-[#a0a0b8] p-4 min-h-[160px]">
      {menuView === "main" ? (
        <div className="grid grid-cols-2 gap-3 h-full">
          <ActionButton onClick={onOpenAttacks} color="red" icon={<Swords className="w-4 h-4" />} disabled={locked}>
            LUTAR
          </ActionButton>
          <ActionButton onClick={onOpenBag} color="amber" icon={<Backpack className="w-4 h-4" />}>
            MOCHILA
          </ActionButton>
          <ActionButton onClick={onOpenPokemon} color="green" icon={<Users className="w-4 h-4" />} disabled={locked}>
            POKÉMON
          </ActionButton>
          <ActionButton onClick={onOpenChat} color="blue" icon={<MessageCircle className="w-4 h-4" />}>
            CHAT
          </ActionButton>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 h-full">
          <ActionButton
            onClick={() => {
              if (!canUseSelectedMove) return;
              onUseMove();
            }}
            color="red"
            icon={<Swords className="w-4 h-4" />}
            disabled={locked || !canUseSelectedMove}
          >
            USAR MOVIMENTO
          </ActionButton>
          <ActionButton onClick={onBackToMain} color="slate" icon={<ArrowLeft className="w-4 h-4" />}>
            VOLTAR
          </ActionButton>
        </div>
      )}
      {locked && (
        <p className="text-center font-display text-[10px] text-muted-foreground tracking-widest pt-2">
          AGUARDANDO O TURNO SER RESOLVIDO...
        </p>
      )}
    </div>
  );
}
