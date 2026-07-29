import { ChevronRight } from "lucide-react";
import { MenuView } from "./types";
import { IBattlePokemonMove } from "@/types/IBattle";

interface BattleDialogPanelProps {
  menuView: MenuView;
  dialogText: string;
  activePokemonName: string;
  moves: IBattlePokemonMove[];
  selectedMoveIdx: number | null;
  onSelectMove: (idx: number) => void;
}

export function BattleDialogPanel({
  menuView,
  dialogText,
  activePokemonName,
  moves,
  selectedMoveIdx,
  onSelectMove,
}: BattleDialogPanelProps) {
  return (
    <div className="bg-[#3858a0] border-4 border-[#c8a038] border-r-0 min-h-[160px] p-5 flex items-center">
      {menuView === "main" ? (
        <p className="font-display text-lg md:text-xl text-white leading-relaxed">
          {dialogText || `O que ${activePokemonName} deve fazer?`}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 w-full">
          {moves.map((m, i) => {
            const isStatusMove = m.move.power === null;
            const disabled = m.currentPp <= 0 || isStatusMove;
            const selected = selectedMoveIdx === i;
            return (
              <button
                key={m.id}
                disabled={disabled}
                onClick={() => onSelectMove(i)}
                className={`flex items-center gap-2 font-display text-white text-base md:text-lg uppercase tracking-wider text-left ${
                  disabled ? "opacity-40 cursor-not-allowed" : "hover:text-yellow-200"
                }`}
              >
                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-opacity ${
                    selected ? "opacity-100 text-yellow-300" : "opacity-0"
                  }`}
                />
                <span className="flex-1">
                  {m.move.name}
                  {isStatusMove && <span className="text-[10px] normal-case ml-1">(em breve)</span>}
                </span>
                <span className="text-xs opacity-80 normal-case">
                  {m.currentPp}/{m.maxPp}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
