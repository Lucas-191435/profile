'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bot, Check, Copy, Loader2, Shuffle, Swords, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { successToast } from "@/utils/toasts";
import { useBattleContext } from "@/context/BattleContext";
import { useCancelBattle, useTestTrainers } from "@/services/queries/useBattle";
import { TRAINERS } from "@/utils/trainers";

interface WaitingOpponentScreenProps {
  battleId: string;
  teamLabel: string;
}

export function WaitingOpponentScreen({ battleId, teamLabel }: WaitingOpponentScreenProps) {
  const router = useRouter();
  const { joinBattleBot, currentUserId } = useBattleContext();
  const { mutateAsync: cancelBattle, isPending: isCancelling } = useCancelBattle();
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

  // Sair da sala apaga a batalha no back — senão ela continuaria listada como "aguardando oponente".
  const handleLeave = async () => {
    if (isCancelling || isJoiningBot) return;
    try {
      await cancelBattle(battleId);
      router.push("/");
    } catch {
      // erro já reportado via toast pelo useCancelBattle
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background p-6 overflow-hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLeave}
        disabled={isCancelling || isJoiningBot}
        className="absolute top-6 left-6 z-10"
      >
        {isCancelling ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ArrowLeft className="w-4 h-4 mr-2" />}
        Cancelar sala
      </Button>

      {/* Fundo: grade sutil + brilhos */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-48 -right-32 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="relative w-full max-w-3xl flex flex-col items-center gap-8">
        {/* Título */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-body text-xs font-semibold text-primary">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            Sala aberta
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-wider text-glow">
            AGUARDANDO OPONENTE
          </h1>
          <p className="font-body text-muted-foreground text-base">
            Time <span className="text-foreground font-semibold">{teamLabel}</span> pronto para a batalha.
          </p>
        </div>

        {/* Você VS ??? */}
        <div className="flex items-center justify-center gap-4 sm:gap-10">
          <div className="flex flex-col items-center gap-2">
            <div className="size-20 sm:size-24 rounded-2xl border-2 border-primary bg-primary/10 glow-red flex items-center justify-center">
              <Swords className="size-10 sm:size-12 text-primary" />
            </div>
            <span className="font-display text-xs sm:text-sm tracking-widest">{teamLabel.toUpperCase()}</span>
          </div>

          <span className="font-display text-3xl sm:text-5xl font-black italic text-primary text-glow">VS</span>

          <div className="flex flex-col items-center gap-2">
            <div className="size-20 sm:size-24 rounded-2xl border-2 border-dashed border-muted-foreground/40 bg-card/50 flex items-center justify-center animate-pulse">
              <span className="font-display text-4xl text-muted-foreground/60">?</span>
            </div>
            <span className="flex items-center gap-1.5 font-display text-xs sm:text-sm tracking-widest text-muted-foreground">
              <Loader2 className="size-3 animate-spin" />
              ...
            </span>
          </div>
        </div>

        {/* Opções */}
        <div className="grid w-full gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                <Users className="size-5" />
              </div>
              <div>
                <h2 className="font-display text-sm font-bold tracking-wide">Desafiar um amigo</h2>
                <p className="font-body text-sm text-muted-foreground">Envie o link e espere ele entrar.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-auto">
              <input
                readOnly
                value={inviteUrl}
                onClick={(e) => e.currentTarget.select()}
                className="min-w-0 flex-1 rounded-lg border border-border/50 bg-background/60 px-3 h-11 font-body text-xs truncate"
              />
              <Button onClick={handleCopy} variant="outline" className="h-11 gap-2 shrink-0">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copiado" : "Copiar"}
              </Button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedTrainerId(null);
              setBotDialogOpen(true);
            }}
            className="group relative overflow-hidden rounded-2xl border border-primary/50 bg-gradient-to-br from-primary/25 via-primary/10 to-card p-5 text-left flex flex-col gap-4 transition-all hover:border-primary hover:-translate-y-1 hover:shadow-[0_0_30px_hsl(0_85%_55%/0.35)] cursor-pointer"
          >
            <Bot className="pointer-events-none absolute -right-4 -bottom-6 size-32 text-primary/10 transition-transform group-hover:scale-110 group-hover:-rotate-6" />
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                <Bot className="size-5" />
              </div>
              <div>
                <h2 className="font-display text-sm font-bold tracking-wide">Batalhar contra a CPU</h2>
                <p className="font-body text-sm text-muted-foreground">Não quer esperar? Lute agora.</p>
              </div>
            </div>
            <span className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary font-display text-sm font-bold tracking-wider text-primary-foreground glow-red transition-colors group-hover:bg-primary/90">
              <Swords className="size-4" />
              LUTAR AGORA
            </span>
          </button>
        </div>
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
