interface ActionButtonProps {
  onClick: () => void;
  color: "red" | "blue" | "green" | "amber" | "slate";
  icon: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
}

const palette: Record<ActionButtonProps["color"], string> = {
  red: "bg-red-200 hover:bg-red-300 border-red-900 text-red-900",
  blue: "bg-blue-200 hover:bg-blue-300 border-blue-900 text-blue-900",
  green: "bg-green-200 hover:bg-green-300 border-green-900 text-green-900",
  amber: "bg-amber-200 hover:bg-amber-300 border-amber-900 text-amber-900",
  slate: "bg-slate-200 hover:bg-slate-300 border-slate-800 text-slate-800",
};

export function ActionButton({ onClick, color, icon, children, disabled }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${palette[color]} border-2 rounded-xl px-2 py-2 md:px-3 font-display font-bold tracking-wider flex items-center justify-center gap-1.5 text-center transition-colors text-[11px] sm:text-xs md:text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-none`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate min-w-0">{children}</span>
    </button>
  );
}
