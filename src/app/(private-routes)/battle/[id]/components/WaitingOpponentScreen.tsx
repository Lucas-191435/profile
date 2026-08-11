'use client';

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Bot, Check, Copy, Loader2, Shuffle, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { successToast } from "@/utils/toasts";
import { useBattleContext } from "@/context/BattleContext";
import { useTestTrainers } from "@/services/queries/useBattle";

interface WaitingOpponentScreenProps {
  battleId: string;
  teamLabel: string;
}

export function WaitingOpponentScreen({ battleId, teamLabel }: WaitingOpponentScreenProps) {
  const { joinBattleBot } = useBattleContext();
  const [copied, setCopied] = useState(false);
  const [botPanelOpen, setBotPanelOpen] = useState(false);
  const [joiningTrainerId, setJoiningTrainerId] = useState<string | null>(null);
  const [joiningRandom, setJoiningRandom] = useState(false);

  const { data: testTrainers, isLoading: isLoadingTrainers } = useTestTrainers({ enabled: botPanelOpen });

  const inviteUrl = typeof window !== "undefined" ? `${window.location.origin}/battle/${battleId}` : "";

  const handleCopy = async () => {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    successToast({ description: "Link copiado!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const isJoiningBot = joiningRandom || joiningTrainerId !== null;

  const handleJoinBot = async (trainerId?: string) => {
    if (isJoiningBot) return;
    if (trainerId) setJoiningTrainerId(trainerId);
    else setJoiningRandom(true);
    try {
      await joinBattleBot(trainerId);
    } catch {
      // erro já reportado via toast pelo useJoinBattleBot
    } finally {
      setJoiningTrainerId(null);
      setJoiningRandom(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 p-6">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/30 blur-2xl animate-pulse" />
        <Swords className="w-16 h-16 text-primary relative" />
      </div>
      <div className="text-center space-y-2">
        <h1 className="font-display text-2xl font-black tracking-wider text-glow">
          AGUARDANDO OPONENTE
        </h1>
        <p className="font-body text-muted-foreground text-sm">
          Time {teamLabel} pronto. Envie o link abaixo para alguém entrar na batalha.
        </p>
      </div>

      <div className="flex items-center gap-2 w-full max-w-md">
        <input
          readOnly
          value={inviteUrl}
          onClick={(e) => e.currentTarget.select()}
          className="flex-1 rounded-lg border border-border/50 bg-card px-3 py-2 font-body text-xs truncate"
        />
        <Button onClick={handleCopy} variant="outline" size="icon">
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>

      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="font-body text-xs">Esperando alguém entrar...</span>
      </div>

      <div className="w-full max-w-md flex flex-col items-center gap-3 pt-2 border-t border-border/30">
        <span className="font-body text-xs text-muted-foreground pt-3">ou</span>

        {!botPanelOpen && (
          <Button
            variant="outline"
            onClick={() => setBotPanelOpen(true)}
            className="gap-2"
          >
            <Bot className="w-4 h-4" />
            Batalhar contra a CPU
          </Button>
        )}

        {botPanelOpen && (
          <div className="w-full flex flex-col gap-3">
            <Button
              onClick={() => handleJoinBot()}
              disabled={isJoiningBot}
              className="w-full bg-primary hover:bg-primary/90 glow-red gap-2"
            >
              {joiningRandom ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shuffle className="w-4 h-4" />}
              Sortear treinador
            </Button>

            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
              {isLoadingTrainers && (
                <span className="font-body text-xs text-muted-foreground text-center">
                  Carregando treinadores...
                </span>
              )}
              {!isLoadingTrainers && (!testTrainers || testTrainers.length === 0) && (
                <span className="font-body text-xs text-muted-foreground text-center">
                  Nenhum treinador de teste disponível.
                </span>
              )}
              {testTrainers?.map((trainer) => (
                <button
                  key={trainer.id}
                  disabled={isJoiningBot}
                  onClick={() => handleJoinBot(trainer.id)}
                  className="w-full rounded-lg border border-border/50 bg-background/40 hover:border-primary/50 p-2.5 text-left transition-all flex items-center gap-3 disabled:opacity-50"
                >
                  {trainer.avatar ? (
                    <img src={trainer.avatar} alt={trainer.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="font-display text-xs font-bold tracking-wider block truncate">
                      {trainer.name}
                    </span>
                    {trainer.description && (
                      <span className="font-body text-[11px] text-muted-foreground block truncate">
                        {trainer.description}
                      </span>
                    )}
                  </div>
                  {joiningTrainerId === trainer.id && <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />}
                </button>
              ))}
            </div>

            <Button variant="ghost" size="sm" onClick={() => setBotPanelOpen(false)} disabled={isJoiningBot}>
              Cancelar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
