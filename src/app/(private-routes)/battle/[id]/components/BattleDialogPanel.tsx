import { ChevronRight } from "lucide-react";
import { MenuView } from "./types";

interface BattleDialogPanelProps {
  menuView: MenuView;
  dialogText: string;
  activePokemonName: string;
  moves: string[];
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
            const disabled = m === "—";
            const selected = selectedMoveIdx === i;
            return (
              <button
                key={i}
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
                <span>{m}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
