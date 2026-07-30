import { useEffect, useRef, useState } from "react";

interface StatusCardProps {
  name: string;
  level: number;
  hpCurrent: number;
  hpMax: number;
  showHpNumbers?: boolean;
  align: "left" | "right";
}

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

export function StatusCard({ name, level, hpCurrent, hpMax, showHpNumbers, align }: StatusCardProps) {
  const animatedHp = useAnimatedNumber(hpCurrent);
  const hpPercent = Math.max(0, Math.min(100, (animatedHp / hpMax) * 100));

  // Cores clássicas de jogo Pokémon: verde acima de 50%, amarelo entre 20-50%, vermelho abaixo.
  const barColorClass =
    hpPercent > 50
      ? "from-[#78e058] to-[#38a828]"
      : hpPercent > 20
      ? "from-[#f8d030] to-[#e0a020]"
      : "from-[#f87058] to-[#d83028]";

  return (
    <div
      className={`bg-[#f8f8d8] border-[3px] border-[#404058] rounded-md px-3 py-2 shadow-[4px_4px_0_rgba(0,0,0,0.35)] min-w-[220px] ${
        align === "right" ? "text-right" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-display text-[13px] font-bold text-[#303030] uppercase tracking-wide">
          {name}
        </span>
        <span className="font-display text-[11px] text-[#303030]">Lv{level}</span>
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
