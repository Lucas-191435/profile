import { MenuView } from "./types";
import { IBattlePokemonMove } from "@/types/IBattle";
import typeColors from "@/utils/typesColors";

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
    <div className="bg-[#3858a0] border-4 border-[#c8a038] border-r-0 min-h-[100px] sm:min-h-[130px] md:min-h-[160px] p-3 sm:p-4 md:p-5 flex items-center">
      {menuView === "main" ? (
        <p className="font-display text-sm sm:text-base md:text-xl text-white leading-relaxed">
          {dialogText || `O que ${activePokemonName} deve fazer?`}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 w-full">
          {moves.map((m, i) => {
            const disabled = m.currentPp <= 0;
            const selected = selectedMoveIdx === i;
            return (
              <button
                key={m.id}
                disabled={disabled}
                onClick={() => onSelectMove(i)}
                className={`flex flex-col gap-0.5 rounded-lg border-2 px-2 py-1 sm:px-3 sm:py-1.5 font-display uppercase tracking-wider text-left transition-colors ${
                  selected
                    ? "border-yellow-300 bg-white/15 text-yellow-200"
                    : "border-transparent text-white"
                } ${
                  disabled
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:border-yellow-200/50 hover:bg-white/5"
                }`}
              >
                <span className="text-xs sm:text-sm md:text-base leading-tight break-words">
                  {m.move.name}
                </span>
                <span className="flex items-center justify-between gap-2 normal-case">
                  <span className="text-[10px] sm:text-xs opacity-80">
                    PP {m.currentPp}/{m.maxPp}
                  </span>
                  {m.move.type && (
                    <span className="flex items-center gap-1 shrink-0">
                      <span className={`${typeColors[m.move.type] ?? "bg-muted"} w-2 h-2 rounded-full shrink-0`} />
                      <span className="text-[9px] sm:text-[10px] opacity-80">{m.move.type}</span>
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
