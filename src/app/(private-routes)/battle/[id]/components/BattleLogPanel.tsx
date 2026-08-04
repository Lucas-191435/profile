"use client";

import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IBattle } from "@/types/IBattle";
import { describeTurnLog, ownerParticipantId } from "../lib/describeTurnLog";
import { sounds } from "@/utils/sounds";

interface BattleLogPanelProps {
  battle: IBattle;
  myParticipantId: string;
  currentUserId?: string;
}

export function BattleLogPanel({ battle, myParticipantId, currentUserId }: BattleLogPanelProps) {
  const [open, setOpen] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => {
          sounds.clickMouse.play();
          setOpen((o) => !o);
        }}
        className="absolute top-4 -left-9 z-10 flex h-9 w-9 items-center justify-center rounded-l-lg border-2 border-r-0 border-[#404058] bg-card text-muted-foreground transition-transform hover:text-foreground active:scale-90"
        aria-label={open ? "Fechar histórico da batalha" : "Abrir histórico da batalha"}
      >
        <span className={open ? undefined : "animate-tab-nudge"}>
          {open ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </span>
        {!open && battle.turnLogs.length > 0 && (
          <span className="absolute -top-1 -right-1 flex size-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
          </span>
        )}
      </button>

      <div
        className={`h-full overflow-hidden transition-[width] duration-300 ease-out ${
          open ? "w-80 sm:w-96" : "w-0"
        }`}
      >
        <div
          className={`flex h-full w-80 sm:w-96 flex-col border-l-4 border-[#404058] bg-card transition-all duration-300 ease-out ${
            open ? "translate-x-0 opacity-100 delay-100" : "-translate-x-4 opacity-0"
          }`}
        >
          <div className="p-4 border-b border-border/30 shrink-0">
            <h2 className="font-display text-sm tracking-wider">Histórico da Batalha</h2>
            <p className="text-xs font-body text-muted-foreground mt-0.5">Clique em um evento para ver o JSON.</p>
          </div>
          <ScrollArea className="flex-1 min-h-0 px-3 py-3">
            {battle.turnLogs.length === 0 ? (
              <p className="text-sm font-body text-muted-foreground px-1">Nenhum evento ainda.</p>
            ) : (
              <ul className="space-y-2">
                {battle.turnLogs.map((log) => {
                  const owner = ownerParticipantId(log);
                  const isMine = owner === myParticipantId;
                  const isOpponent = owner !== null && !isMine;
                  const isExpanded = expandedLogId === log.id;
                  return (
                    <li key={log.id}>
                      <button
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        aria-expanded={isExpanded}
                        className={`w-full text-left rounded-lg border-2 px-3 py-2 transition-colors hover:brightness-110 ${
                          isMine
                            ? "border-[#3858a0]/60 bg-[#3858a0]/10"
                            : isOpponent
                            ? "border-destructive/50 bg-destructive/5"
                            : "border-border/40 bg-muted/20"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`block font-display text-[9px] tracking-widest mb-0.5 ${
                              isMine ? "text-[#5b7fd4]" : isOpponent ? "text-destructive" : "text-muted-foreground"
                            }`}
                          >
                            {isMine ? "VOCÊ" : isOpponent ? "OPONENTE" : "SISTEMA"} · TURNO {log.turnNumber}
                          </span>
                          <ChevronDown
                            className={`size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                        <p className="text-sm font-body leading-snug">
                          {describeTurnLog(log.payload, battle, currentUserId)}
                        </p>
                        <div
                          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                            isExpanded ? "grid-rows-[1fr] mt-2" : "grid-rows-[0fr]"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <pre className="max-w-full overflow-x-auto rounded bg-black/85 p-2 text-[10px] text-green-300 font-mono whitespace-pre-wrap break-words">
                              {JSON.stringify(log, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
