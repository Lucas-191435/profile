interface ActionButtonProps {
  onClick: () => void;
  color: "red" | "blue" | "green" | "amber" | "slate";
  icon: React.ReactNode;
  children: React.ReactNode;
}

const palette: Record<ActionButtonProps["color"], string> = {
  red: "bg-red-200 hover:bg-red-300 border-red-900 text-red-900",
  blue: "bg-blue-200 hover:bg-blue-300 border-blue-900 text-blue-900",
  green: "bg-green-200 hover:bg-green-300 border-green-900 text-green-900",
  amber: "bg-amber-200 hover:bg-amber-300 border-amber-900 text-amber-900",
  slate: "bg-slate-200 hover:bg-slate-300 border-slate-800 text-slate-800",
};

export function ActionButton({ onClick, color, icon, children }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${palette[color]} border-2 rounded-xl px-3 py-2 font-display font-bold tracking-wider flex items-center justify-center gap-2 transition-colors text-sm`}
    >
      {icon} {children}
    </button>
  );
}
