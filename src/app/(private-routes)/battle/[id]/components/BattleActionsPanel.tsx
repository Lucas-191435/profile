import { ArrowLeft, Backpack, MessageCircle, Swords, Users } from "lucide-react";
import { ActionButton } from "./ActionButton";
import { MenuView } from "./types";

interface BattleActionsPanelProps {
  menuView: MenuView;
  moves: string[];
  selectedMoveIdx: number | null;
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
  onOpenAttacks,
  onOpenBag,
  onOpenPokemon,
  onOpenChat,
  onBackToMain,
  onUseMove,
}: BattleActionsPanelProps) {
  return (
    <div className="bg-[#f8f8f8] border-4 border-[#a0a0b8] p-4 min-h-[160px]">
      {menuView === "main" ? (
        <div className="grid grid-cols-2 gap-3 h-full">
          <ActionButton onClick={onOpenAttacks} color="red" icon={<Swords className="w-4 h-4" />}>
            LUTAR
          </ActionButton>
          <ActionButton onClick={onOpenBag} color="amber" icon={<Backpack className="w-4 h-4" />}>
            MOCHILA
          </ActionButton>
          <ActionButton onClick={onOpenPokemon} color="green" icon={<Users className="w-4 h-4" />}>
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
              if (selectedMoveIdx === null) return;
              if (moves[selectedMoveIdx] === "—") return;
              onUseMove();
            }}
            color="red"
            icon={<Swords className="w-4 h-4" />}
          >
            USAR MOVIMENTO
          </ActionButton>
          <ActionButton onClick={onBackToMain} color="slate" icon={<ArrowLeft className="w-4 h-4" />}>
            VOLTAR
          </ActionButton>
        </div>
      )}
    </div>
  );
}
