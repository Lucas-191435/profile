import { Loader2 } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl animate-pulse" />
        <Loader2 className="w-16 h-16 text-primary animate-spin relative" />
      </div>
      <p className="font-display tracking-widest text-primary text-sm">
        CARREGANDO BATALHA...
      </p>
      <p className="font-body text-muted-foreground text-xs">Preparando o campo</p>
    </div>
  );
}
