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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
          {moves.map((m, i) => {
            const disabled = m.currentPp <= 0;
            const selected = selectedMoveIdx === i;
            return (
              <button
                key={m.id}
                disabled={disabled}
                onClick={() => onSelectMove(i)}
                className={`flex flex-col gap-0.5 rounded-lg border-2 px-3 py-1.5 font-display uppercase tracking-wider text-left transition-colors ${
                  selected
                    ? "border-yellow-300 bg-white/15 text-yellow-200"
                    : "border-transparent text-white"
                } ${
                  disabled
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:border-yellow-200/50 hover:bg-white/5"
                }`}
              >
                <span className="text-sm md:text-base leading-tight break-words">
                  {m.move.name}
                </span>
                <span className="text-xs opacity-80 normal-case">
                  PP {m.currentPp}/{m.maxPp}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
