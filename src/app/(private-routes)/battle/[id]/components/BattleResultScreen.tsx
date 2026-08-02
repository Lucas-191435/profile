import { Trophy, Skull, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BattleResultScreenProps {
  didWin: boolean;
  iForfeited: boolean;
  onExit: () => void;
}

export function BattleResultScreen({ didWin, iForfeited, onExit }: BattleResultScreenProps) {
  const title = iForfeited ? "VOCÊ DESISTIU" : didWin ? "VITÓRIA!" : "DERROTA";
  const subtitle = iForfeited
    ? "Você abandonou a batalha."
    : didWin
    ? "Seu time venceu a batalha!"
    : "Seu time foi derrotado.";

  const Icon = iForfeited ? Flag : didWin ? Trophy : Skull;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 p-6">
      <div className="relative">
        <div
          className={`absolute inset-0 rounded-full blur-2xl ${
            didWin && !iForfeited ? "bg-yellow-400/30" : "bg-primary/20"
          }`}
        />
        <Icon
          className={`w-20 h-20 relative ${
            iForfeited ? "text-muted-foreground" : didWin ? "text-yellow-400" : "text-destructive"
          }`}
        />
      </div>
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl font-black tracking-wider text-glow">{title}</h1>
        <p className="font-body text-muted-foreground text-sm">{subtitle}</p>
      </div>
      <Button
        size="lg"
        onClick={onExit}
        className="bg-primary hover:bg-primary/90 glow-red font-display tracking-wider"
      >
        Voltar ao início
      </Button>
    </div>
  );
}
