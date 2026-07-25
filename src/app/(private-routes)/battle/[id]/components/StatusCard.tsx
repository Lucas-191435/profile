interface StatusCardProps {
  name: string;
  level: number;
  hpCurrent: number;
  hpMax: number;
  showHpNumbers?: boolean;
  align: "left" | "right";
}

export function StatusCard({ name, level, hpCurrent, hpMax, showHpNumbers, align }: StatusCardProps) {
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
            className="h-full bg-gradient-to-b from-[#78e058] to-[#38a828]"
            style={{ width: `${(hpCurrent / hpMax) * 100}%` }}
          />
        </div>
      </div>
      {showHpNumbers && (
        <div className="text-right font-display text-[10px] text-[#303030] mt-0.5">
          {hpCurrent}/{hpMax}
        </div>
      )}
    </div>
  );
}
