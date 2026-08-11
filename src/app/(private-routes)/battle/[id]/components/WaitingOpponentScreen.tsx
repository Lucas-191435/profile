'use client';

import { useState } from "react";
import { Bot, Check, Copy, Loader2, Shuffle, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { successToast } from "@/utils/toasts";
import { useBattleContext } from "@/context/BattleContext";
import { useTestTrainers } from "@/services/queries/useBattle";
import { TRAINERS } from "@/utils/trainers";

interface WaitingOpponentScreenProps {
  battleId: string;
  teamLabel: string;
}

export function WaitingOpponentScreen({ battleId, teamLabel }: WaitingOpponentScreenProps) {
  const { joinBattleBot, currentUserId } = useBattleContext();
  const [copied, setCopied] = useState(false);
  const [botDialogOpen, setBotDialogOpen] = useState(false);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(null);
  const [joiningTrainerId, setJoiningTrainerId] = useState<string | null>(null);
  const [joiningRandom, setJoiningRandom] = useState(false);

  const { data: testTrainers, isLoading: isLoadingTrainers } = useTestTrainers({ enabled: botDialogOpen });
  // Não faz sentido oferecer o próprio usuário de teste logado como oponente da CPU.
  const availableTrainers = testTrainers?.filter((trainer) => trainer.id !== currentUserId);

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
      setBotDialogOpen(false);
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

        <Button
          variant="outline"
          onClick={() => {
            setSelectedTrainerId(null);
            setBotDialogOpen(true);
          }}
          className="gap-2"
        >
          <Bot className="w-4 h-4" />
          Batalhar contra a CPU
        </Button>
      </div>

      <Dialog
        open={botDialogOpen}
        onOpenChange={(open) => {
          if (isJoiningBot) return;
          setBotDialogOpen(open);
        }}
      >
        <DialogContent className="bg-card border-border/50 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display">Escolha um oponente</DialogTitle>
            <DialogDescription className="text-[16px] text-white">
              Selecione um treinador de teste pra batalhar contra a CPU, ou sorteie um aleatório.
            </DialogDescription>
          </DialogHeader>

          <Button
            onClick={() => handleJoinBot()}
            disabled={isJoiningBot}
            className="w-full bg-primary hover:bg-primary/90 glow-red gap-2"
          >
            {joiningRandom ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shuffle className="w-4 h-4" />}
            Sortear treinador
          </Button>

          <ScrollArea className="max-h-[60vh] pr-2">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-2">
              {isLoadingTrainers && (
                <span className="col-span-full font-body text-xs text-muted-foreground text-center py-4">
                  Carregando treinadores...
                </span>
              )}
              {!isLoadingTrainers && (!availableTrainers || availableTrainers.length === 0) && (
                <span className="col-span-full font-body text-xs text-muted-foreground text-center py-4">
                  Nenhum treinador de teste disponível.
                </span>
              )}
              {availableTrainers?.map((testTrainer) => {
                const trainer = TRAINERS.find((t) => t.id === testTrainer.avatar) ?? TRAINERS[0];
                const active = testTrainer.id === selectedTrainerId;
                return (
                  <button
                    key={testTrainer.id}
                    type="button"
                    disabled={isJoiningBot}
                    onClick={() => setSelectedTrainerId(testTrainer.id)}
                    className={cn(
                      "rounded-xl border-2 p-2 flex flex-col items-center gap-1 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100",
                      active
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                        : "border-border/40 bg-background/40",
                    )}
                  >
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={trainer.url} alt={trainer.name} className="object-contain" />
                      <AvatarFallback className="font-display">{testTrainer.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-display text-xs tracking-wide truncate w-full text-center">
                      {testTrainer.name}
                    </span>
                    {joiningTrainerId === testTrainer.id && (
                      <Loader2 className="w-3 h-3 animate-spin text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setBotDialogOpen(false)}
              disabled={isJoiningBot}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={!selectedTrainerId || isJoiningBot}
              onClick={() => handleJoinBot(selectedTrainerId ?? undefined)}
            >
              {joiningTrainerId ? <Loader2 className="w-4 h-4 animate-spin" /> : "Escolher oponente"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
