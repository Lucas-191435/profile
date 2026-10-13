export type ChatColor = {
  bubble: string;
  name: string;
  ring: string;
};

// Sem vermelho: é a cor das mensagens do próprio usuário (primary).
// Classes literais para o Tailwind encontrar no build.
const PALETTE: ChatColor[] = [
  { bubble: "bg-blue-500/15 border-blue-500/40", name: "text-blue-400", ring: "ring-blue-500/70" },
  { bubble: "bg-emerald-500/15 border-emerald-500/40", name: "text-emerald-400", ring: "ring-emerald-500/70" },
  { bubble: "bg-amber-500/15 border-amber-500/40", name: "text-amber-400", ring: "ring-amber-500/70" },
  { bubble: "bg-violet-500/15 border-violet-500/40", name: "text-violet-400", ring: "ring-violet-500/70" },
  { bubble: "bg-cyan-500/15 border-cyan-500/40", name: "text-cyan-400", ring: "ring-cyan-500/70" },
  { bubble: "bg-pink-500/15 border-pink-500/40", name: "text-pink-400", ring: "ring-pink-500/70" },
  { bubble: "bg-orange-500/15 border-orange-500/40", name: "text-orange-400", ring: "ring-orange-500/70" },
  { bubble: "bg-lime-500/15 border-lime-500/40", name: "text-lime-400", ring: "ring-lime-500/70" },
];

/** Cor fixa por treinador: o mesmo userId sempre cai na mesma cor. */
export const getChatColor = (userId: string): ChatColor => {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) | 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
};
