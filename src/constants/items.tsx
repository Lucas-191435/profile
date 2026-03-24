
import { Package, Shield, Beaker, Sword, Star, WandSparkles, Key, Disc3, Mail } from "lucide-react";

export const ItemCategoryColor: Record<string, string> = {
  ["1"]: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  ["2"]: "bg-green-500/20 text-green-400 border-green-500/30",
  ["3"]: "bg-primary/20 text-primary border-primary/30",
  ["4"]: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  ["5"]: "bg-accent/20 text-accent border-accent/30",
  ["6"]: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  ["7"]: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  ["8"]: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

export const CATEGORIES: { key: number ; label: string; icon: React.ReactNode }[] = [
  { key: 0, label: "Todos", icon: <Package className="w-4 h-4" /> },
  { key: 1, label: "Mistico", icon: <WandSparkles className="w-4 h-4" /> },
  { key: 2, label: "Medicina", icon: <Beaker className="w-4 h-4" /> },
  { key: 3, label: "Poké Balls", icon: <Star className="w-4 h-4" /> },
  { key: 4, label: "HMs/TMs", icon: <Disc3 className="w-4 h-4" /> },
  { key: 5, label: "Held Items", icon: <Shield className="w-4 h-4" /> },
  { key: 6, label: "Carta", icon: <Mail className="w-4 h-4" /> },
  { key: 7, label: "Batalha", icon: <Sword className="w-4 h-4" /> },
  { key: 8, label: "Chave", icon: <Key className="w-4 h-4" /> },
];