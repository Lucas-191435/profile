'use client';

import { useState } from "react";
import { Check, Copy, Loader2, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { successToast } from "@/utils/toasts";

interface WaitingOpponentScreenProps {
  battleId: string;
  teamLabel: string;
}

export function WaitingOpponentScreen({ battleId, teamLabel }: WaitingOpponentScreenProps) {
  const [copied, setCopied] = useState(false);

  const inviteUrl = typeof window !== "undefined" ? `${window.location.origin}/battle/${battleId}` : "";

  const handleCopy = async () => {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    successToast({ description: "Link copiado!" });
    setTimeout(() => setCopied(false), 2000);
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
    </div>
  );
}
