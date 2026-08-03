import { useEffect, useRef, useState } from "react";
import { StatKey, StatusCondition } from "@/types/IBattle";

export type StatusCardEffect =
  | { kind: "status"; status: StatusCondition; variant: "applied" | "cured" }
  | { kind: "stat"; stat: StatKey; stages: number }
  | { kind: "heal"; amount: number };

interface StatusCardProps {
  name: string;
  level: number;
  hpCurrent: number;
  hpMax: number;
  showHpNumbers?: boolean;
  align: "left" | "right";
  statusCondition?: StatusCondition;
  effect?: StatusCardEffect | null;
  effectKey?: number;
}

const STATUS_BADGE: Record<Exclude<StatusCondition, "NONE">, { abbr: string; color: string }> = {
  PARALYZED: { abbr: "PAR", color: "#f8d030" },
  POISONED: { abbr: "PSN", color: "#a040a0" },
  BURNED: { abbr: "BRN", color: "#f08030" },
  ASLEEP: { abbr: "SLP", color: "#78909c" },
  FROZEN: { abbr: "FRZ", color: "#68d0e0" },
  CONFUSED: { abbr: "CONF", color: "#f85888" },
};

const STAT_LABELS: Record<StatKey, string> = {
  atk: "ATAQUE",
  def: "DEFESA",
  spAtk: "AT.ESP.",
  spDef: "DEF.ESP.",
  speed: "VELOC.",
  accuracy: "PREC.",
  evasion: "EVAS.",
};

// Interpola suavemente entre o valor de HP anterior e o novo via requestAnimationFrame — sem
// isso, a barra e o número pulam direto pro valor final assim que o snapshot chega.
function useAnimatedNumber(target: number, duration = 600) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;

    let rafId: number;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + (target - from) * eased);
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        fromRef.current = target;
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration]);

  return value;
}

export function StatusCard({
  name,
  level,
  hpCurrent,
  hpMax,
  showHpNumbers,
  align,
  statusCondition,
  effect,
  effectKey,
}: StatusCardProps) {
  const animatedHp = useAnimatedNumber(hpCurrent);
  const hpPercent = Math.max(0, Math.min(100, (animatedHp / hpMax) * 100));

  // Cores clássicas de jogo Pokémon: verde acima de 50%, amarelo entre 20-50%, vermelho abaixo.
  const barColorClass =
    hpPercent > 50
      ? "from-[#78e058] to-[#38a828]"
      : hpPercent > 20
      ? "from-[#f8d030] to-[#e0a020]"
      : "from-[#f87058] to-[#d83028]";

  const statusBadge = statusCondition && statusCondition !== "NONE" ? STATUS_BADGE[statusCondition] : null;
  const isStatusFlash = effect?.kind === "status" && effect.variant === "applied";
  const isCureFlash = effect?.kind === "status" && effect.variant === "cured";
  const flashColor = isStatusFlash && statusCondition && statusCondition !== "NONE" ? STATUS_BADGE[statusCondition].color : undefined;

  return (
    <div
      className={`relative bg-[#f8f8d8] border-[3px] border-[#404058] rounded-md px-3 py-2 shadow-[4px_4px_0_rgba(0,0,0,0.35)] min-w-[220px] ${
        align === "right" ? "text-right" : ""
      } ${isStatusFlash ? "animate-status-flash" : ""} ${isCureFlash ? "animate-cure-flash" : ""}`}
      style={flashColor ? ({ "--status-flash-color": flashColor } as React.CSSProperties) : undefined}
    >
      {effect?.kind === "stat" && (
        <div
          key={effectKey}
          className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[10px] font-bold animate-float-up-fade pointer-events-none"
          style={{ color: effect.stages > 0 ? "#38a828" : "#d83028" }}
        >
          {STAT_LABELS[effect.stat]} {effect.stages > 0 ? "▲".repeat(Math.min(effect.stages, 3)) : "▼".repeat(Math.min(-effect.stages, 3))}
        </div>
      )}
      {effect?.kind === "heal" && (
        <div
          key={effectKey}
          className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[10px] font-bold text-[#38a828] animate-float-up-fade pointer-events-none"
        >
          +{effect.amount} HP
        </div>
      )}

      <div className="flex items-center justify-between mb-1">
        <span className="font-display text-[13px] font-bold text-[#303030] uppercase tracking-wide">{name}</span>
        <div className="flex items-center gap-1">
          {statusBadge && (
            <span
              className="font-display text-[9px] font-black px-1 py-[1px] rounded-sm text-white uppercase"
              style={{ backgroundColor: statusBadge.color }}
            >
              {statusBadge.abbr}
            </span>
          )}
          <span className="font-display text-[11px] text-[#303030]">Lv{level}</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-[10px] font-black text-[#c88030] italic">HP</span>
        <div className="flex-1 h-[6px] bg-[#303030] rounded-full overflow-hidden border border-[#303030]">
          <div
            className={`h-full bg-gradient-to-b transition-all duration-500 ease-out ${barColorClass}`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>
      {showHpNumbers && (
        <div className="text-right font-display text-[10px] text-[#303030] mt-0.5">
          {Math.round(animatedHp)}/{hpMax}
        </div>
      )}
    </div>
  );
}
