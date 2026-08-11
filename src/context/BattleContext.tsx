'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { Socket } from "socket.io-client";
import { useBattleSocket } from "@/hooks/useBattleSocket";
import { useBattleSnapshot, useCreateBattle, useJoinBattle, useJoinBattleBot } from "@/services/queries/useBattle";
import {
  BattleUpdatedEvent,
  IBattle,
  IBattlePokemon,
  IBattleParticipant,
  IBattleTurnLog,
  OpponentActionSubmittedEvent,
  SubmitActionPayload,
  TeamName,
  TurnLogEntry,
  TurnResolvedEvent,
} from "@/types/IBattle";
import { errorToast } from "@/utils/toasts";

/** Backend não devolve um formato único de erro no ack do WS — ver docs/battle-frontend-plan-v2.md §2. */
function extractSocketErrorMessage(err: unknown): string {
  if (typeof err === "object" && err !== null) {
    const anyErr = err as Record<string, unknown>;
    if (typeof anyErr.message === "string") return anyErr.message;
    if (typeof anyErr.error === "object" && anyErr.error && "message" in anyErr.error) {
      return String((anyErr.error as Record<string, unknown>).message);
    }
  }
  return "Erro desconhecido na batalha.";
}

function isSocketErrorResponse(response: unknown): boolean {
  if (!response || typeof response !== "object") return false;
  const anyRes = response as Record<string, unknown>;
  if ("statusCode" in anyRes) return true;
  if (typeof anyRes.message !== "string") return false;
  // respostas de sucesso conhecidas (snapshot, participant, {received:true}) sempre têm um desses campos.
  return !("id" in anyRes) && !("received" in anyRes);
}

// Extrai o efeito de HP (se houver) de um evento de log — unifica dano (positivo) e cura
// (negativo, pra manter a barra "baixa" até a animação de heal revelar o valor real).
function getHpEffect(entry: TurnLogEntry): { battlePokemonId: string; delta: number } | null {
  switch (entry.event) {
    case "move":
      return entry.missed ? null : { battlePokemonId: entry.targetBattlePokemonId, delta: entry.damage };
    case "confusion-hit":
    case "status-tick":
    case "recoil":
      return { battlePokemonId: entry.battlePokemonId, delta: entry.damage };
    case "heal":
      return { battlePokemonId: entry.battlePokemonId, delta: -entry.amount };
    default:
      return null;
  }
}

function emitWithAck<T>(socket: Socket, event: string, payload: unknown, timeoutMs = 10000): Promise<T> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new Error("A batalha não respondeu a tempo."));
    }, timeoutMs);

    socket.emit(event, payload, (response: unknown) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (isSocketErrorResponse(response)) {
        reject(new Error(extractSocketErrorMessage(response)));
        return;
      }
      resolve(response as T);
    });
  });
}

interface BattleContextType {
  battle: IBattle | null;
  isLoading: boolean;
  isConnected: boolean;
  isParticipant: boolean;
  currentUserId: string | undefined;
  myParticipant: IBattleParticipant | null;
  opponentParticipant: IBattleParticipant | null;
  lastLog: IBattleTurnLog[];
  // Fila ordenada dos eventos do turno recém-resolvido (mesma ordem de execução do backend),
  // consumida item a item para tocar a animação/diálogo de cada ataque em sequência.
  activeTurnEvent: TurnLogEntry | null;
  // Incrementa a cada novo evento no topo da fila — usado como React key pra reiniciar
  // animações transitórias (flash de status, seta de stat, +HP de heal) a cada ocorrência.
  activeTurnEventSeq: number;
  advanceTurnEvent: () => void;
  // HP "exibido" ainda soma o dano dos eventos da fila que não terminaram de tocar — o snapshot
  // já chega com o HP final do turno inteiro, então sem isso a barra pularia pro valor final
  // assim que o turno resolve, antes mesmo do shake do golpe que causou aquele dano.
  getDisplayHp: (battlePokemonId: string, actualHp: number, maxHp: number) => number;
  // Enquanto a troca de Pokémon (evento "switch") de um participante ainda não chegou na frente
  // da fila de eventos do turno, mostra o Pokémon que estava ativo ANTES do turno em vez do que
  // já veio trocado no snapshot — sem isso o Pokémon novo aparece (com animação de entrada) antes
  // mesmo do golpe que derrubou o anterior terminar de tocar, já que o snapshot pós-turno chega
  // com o `activeSlot` já apontando pro substituto (o backend resolve a troca do bot inline).
  getDisplayActivePokemon: (participant: IBattleParticipant | null) => IBattlePokemon | null;
  mySubmitted: boolean;
  opponentSubmitted: boolean;
  readyParticipantIds: Set<string>;
  iForfeited: boolean;
  createBattle: (teamName: TeamName) => Promise<{ id: string }>;
  joinBattle: (teamName: TeamName) => Promise<void>;
  joinBattleBot: (trainerId?: string) => Promise<void>;
  selectLead: (battlePokemonId: string) => Promise<void>;
  ready: () => Promise<void>;
  submitMove: (moveId: string) => Promise<void>;
  submitSwitch: (targetPokemonId: string) => Promise<void>;
  forfeit: () => Promise<void>;
}

const BattleContext = createContext<BattleContextType | undefined>(undefined);

export const BattleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const params = useParams<{ id: string }>();
  const battleId = typeof params?.id === "string" ? params.id : "";
  const { data: session } = useSession();
  const { socket, connected } = useBattleSocket();
  const queryClient = useQueryClient();
  const createBattleMutation = useCreateBattle();
  const joinBattleMutation = useJoinBattle();
  const joinBattleBotMutation = useJoinBattleBot();

  console.log("Vendo id da batalha", params.id)

  const { data: battle, isLoading, refetch } = useBattleSnapshot({ battleId });

  const [readyParticipantIds, setReadyParticipantIds] = useState<Set<string>>(new Set());
  // Guardam o turnNumber em que a flag otimista foi setada — comparado ao turno atual do
  // snapshot, isso substitui um efeito de "resetar quando o turno mudar" por estado derivado.
  const [mySubmittedForTurn, setMySubmittedForTurn] = useState<number | null>(null);
  const [opponentSubmittedForTurn, setOpponentSubmittedForTurn] = useState<number | null>(null);
  const [iForfeited, setIForfeited] = useState(false);
  // participantId -> activeSlot de ANTES do turno, só enquanto o evento "switch" correspondente
  // ainda não chegou na frente da fila (ver comentário de getDisplayActivePokemon abaixo).
  const [frozenActiveSlot, setFrozenActiveSlot] = useState<Record<string, number>>({});
  const [turnEventQueue, setTurnEventQueue] = useState<TurnLogEntry[]>([]);
  const [lastBattleId, setLastBattleId] = useState(battleId);
  const battleRef = useRef<IBattle | null>(null);

  useEffect(() => {
    battleRef.current = battle ?? null;
  }, [battle]);

  const setSnapshot = useCallback(
    (snapshot: IBattle) => {
      queryClient.setQueryData(["battle", battleId], snapshot);
    },
    [queryClient, battleId],
  );

  const currentUserId = session?.user?.id;

  // Derivado do snapshot REST (agora buscado sempre, não só via ack do socket) — cobre o caso
  // de F5 no meio de um IN_PROGRESS: o snapshot já chega com os times, activeSlot e turnLogs
  // dos dois participantes, então não depende do "join-battle" do socket ter sucesso pra saber
  // se o usuário já é participante. Enquanto o snapshot ainda não chegou, mantém true (estado
  // "indeterminado") pra não piscar a tela de convite antes da hora.
  const isParticipant = !battle || !currentUserId || battle.participants.some((p) => p.userId === currentUserId);

  const myParticipant = useMemo(
    () => battle?.participants.find((p) => p.userId === currentUserId) ?? null,
    [battle, currentUserId],
  );
  const opponentParticipant = useMemo(
    () => battle?.participants.find((p) => p.userId !== currentUserId) ?? null,
    [battle, currentUserId],
  );

  const lastLog = battle?.turnLogs ?? [];
  // mySubmittedForTurn/opponentSubmittedForTurn são otimistas (via emit/evento de socket) e não
  // sobrevivem a um refresh — pendingAction vem do snapshot persistido e cobre esse caso.
  const mySubmitted =
    !!battle && (mySubmittedForTurn === battle.turnNumber || myParticipant?.pendingAction != null);
  const opponentSubmitted =
    !!battle && (opponentSubmittedForTurn === battle.turnNumber || opponentParticipant?.pendingAction != null);

  // O provider é reaproveitado entre navegações dentro da mesma layout (ex.: revanche),
  // então o estado de "pronto" (efêmero no backend) precisa ser limpo na troca de battleId.
  if (battleId !== lastBattleId) {
    setLastBattleId(battleId);
    if (readyParticipantIds.size > 0) setReadyParticipantIds(new Set());
    if (turnEventQueue.length > 0) setTurnEventQueue([]);
    if (Object.keys(frozenActiveSlot).length > 0) setFrozenActiveSlot({});
  }

  // Chave da última sala que este socket (socket.id muda a cada reconexão) confirmou ter
  // entrado com sucesso — usada pela rede de segurança abaixo pra saber se precisa reemitir
  // "join-battle" ou não.
  const joinedRoomKeyRef = useRef<string | null>(null);

  const joinRoom = useCallback(async () => {
    if (!battleId || !socket.connected) return;
    try {
      const snapshot = await emitWithAck<IBattle>(socket, "join-battle", { battleId });
      setSnapshot(snapshot);
      joinedRoomKeyRef.current = `${socket.id}:${battleId}`;
    } catch {
      // Sem-ops aqui: `isParticipant` é derivado do snapshot REST, não dessa falha de ack.
      // A rede de segurança abaixo detecta que `joinedRoomKeyRef` continua sem bater e tenta
      // de novo — não precisa travar nem redirecionar o usuário por causa disso.
    }
  }, [battleId, socket, setSnapshot]);

  // No connect inicial e em toda reconexão, reentra na sala e repopula o estado do zero — mas
  // só se o usuário JÁ for um participante confirmado desta batalha (checa `battleRef.current`,
  // não `battle` direto, pra não precisar listar `battle` nas deps e arriscar perder o evento
  // "connect" por causa de closures desatualizadas). "join-battle" é uma ação deG "reentrar numa
  // batalha que eu já estou", não de "entrar pela primeira vez" — quem abre um link de convite
  // ainda não tem `BattleParticipant` no banco, então emitir isso pra ele é rejeitado pelo
  // backend (e pode até derrubar a conexão) e deixa a tela travada em loading pra sempre, sem
  // nunca chegar na JoinBattleScreen. Só a ação explícita de `joinBattle()` (botão "Entrar") deve
  // chamar `join-battle` para quem ainda não é participante — depois que o POST REST já criou o
  // registro dele.
  // Ouve o evento "connect" do próprio socket em vez de depender da transição do state
  // `connected` — um disconnect+reconnect rápido demais pode ser batchado pelo React numa
  // transição invisível (false→true no mesmo tick não muda o valor final), o que faria esse
  // efeito nunca reexecutar e a nova conexão nunca receber seu join-battle.
  useEffect(() => {
    const handleConnect = () => {
      const knownBattle = battleRef.current;
      if (!knownBattle || !currentUserId) return;
      if (!knownBattle.participants.some((p) => p.userId === currentUserId)) return;
      void joinRoom();
    };
    if (socket.connected) handleConnect();
    socket.on("connect", handleConnect);
    return () => {
      socket.off("connect", handleConnect);
    };
  }, [socket, joinRoom, currentUserId]);

  // Rede de segurança: o efeito de "connect" acima pode não ter disparado ainda (ex.: o socket
  // conectou antes do snapshot REST confirmar a participação) ou pode ter falhado em silêncio
  // (ack demorou, caiu no meio, etc.), deixando o socket "conectado" na aparência mas sem sala no
  // servidor — qualquer ação (submit-action) nesse estado é recusada como se o usuário não
  // tivesse entrado na batalha. Assim que o snapshot REST confirma que o usuário logado é
  // participante desta batalha, valida se ESTA conexão (`socket.id`) já confirmou entrada nela
  // e, se não, tenta de novo em loop até conseguir (ou até essas condições mudarem).
  useEffect(() => {
    if (!connected || !battle || !currentUserId || !socket.id) return;
    if (!battle.participants.some((p) => p.userId === currentUserId)) return;

    const roomKey = `${socket.id}:${battleId}`;
    if (joinedRoomKeyRef.current === roomKey) return;

    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout>;

    const attempt = async () => {
      await joinRoom();
      if (cancelled) return;
      if (joinedRoomKeyRef.current !== roomKey) {
        retryTimer = setTimeout(attempt, 3000);
      }
    };
    void attempt();

    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
    };
  }, [connected, battle, currentUserId, socket, battleId, joinRoom]);

  useEffect(() => {
    const handleBattleUpdated = (event: BattleUpdatedEvent) => {
      if ("ready" in event) {
        setReadyParticipantIds((prev) => new Set(prev).add(event.participantId));
      }
      void refetch();
    };

    const handleOpponentActionSubmitted = (event: OpponentActionSubmittedEvent) => {
      if (event.userId !== currentUserId && battleRef.current) {
        setOpponentSubmittedForTurn(battleRef.current.turnNumber);
      }
    };

    const handleTurnResolved = async (event: TurnResolvedEvent) => {
      // Congela o Pokémon ativo ATUAL (pré-turno) de todo participante que troca neste turno —
      // precisa ser lido de `battleRef.current` (o snapshot de ANTES desse turno) porque o
      // refetch logo abaixo já vai trazer o `activeSlot` pós-troca (o backend resolve a troca do
      // bot inline, então ela já chega pronta no mesmo snapshot do turno que a causou). Sem isso
      // o Pokémon novo entraria em cena assim que o refetch resolvesse, antes do golpe que
      // derrubou o anterior sequer começar a tocar.
      const preTurnBattle = battleRef.current;
      const switchEvents = event.log.filter(
        (entry): entry is Extract<TurnLogEntry, { event: "switch" }> => entry.event === "switch",
      );
      if (preTurnBattle && switchEvents.length > 0) {
        setFrozenActiveSlot((prev) => {
          const next = { ...prev };
          for (const switchEvent of switchEvents) {
            const participant = preTurnBattle.participants.find((p) => p.id === switchEvent.participantId);
            if (participant) next[switchEvent.participantId] = participant.activeSlot;
          }
          return next;
        });
      }

      // Espera o snapshot com o HP final do turno chegar ANTES de empilhar os eventos na fila:
      // getDisplayHp soma o dano pendente da fila em cima do `actualHp` do snapshot, então se a
      // fila fosse preenchida antes do refetch resolver, esse `actualHp` ainda seria o do turno
      // anterior — a soma estouraria o HP real e a barra saltaria pra cima antes de cair de volta
      // assim que o refetch chegasse.
      await refetch();
      // event.log preserva a ordem de execução decidida pelo backend (prioridade do golpe +
      // velocidade) — é a partir dela que a UI sabe quem atacou primeiro para animar em sequência.
      setTurnEventQueue((prev) => [...prev, ...event.log]);
    };

    const handleForcedSwitchRequired = () => {
      void refetch();
    };

    const handleBattleEnded = () => {
      void refetch();
    };

    const handleException = (err: unknown) => {
      errorToast({ description: extractSocketErrorMessage(err) });
    };

    socket.on("battle-updated", handleBattleUpdated);
    socket.on("opponent-action-submitted", handleOpponentActionSubmitted);
    socket.on("turn-resolved", handleTurnResolved);
    socket.on("forced-switch-required", handleForcedSwitchRequired);
    socket.on("battle-ended", handleBattleEnded);
    socket.on("exception", handleException);

    return () => {
      socket.off("battle-updated", handleBattleUpdated);
      socket.off("opponent-action-submitted", handleOpponentActionSubmitted);
      socket.off("turn-resolved", handleTurnResolved);
      socket.off("forced-switch-required", handleForcedSwitchRequired);
      socket.off("battle-ended", handleBattleEnded);
      socket.off("exception", handleException);
    };
  }, [socket, refetch, currentUserId]);

  const createBattle = useCallback(
    async (teamName: TeamName) => {
      return createBattleMutation.mutateAsync({ teamName });
    },
    [createBattleMutation],
  );

  const joinBattle = useCallback(
    async (teamName: TeamName) => {
      await joinBattleMutation.mutateAsync({ battleId, teamName });
      // Atualiza o snapshot REST primeiro — garante que `battle.participants` já inclui o
      // usuário mesmo que `joinRoom()` logo abaixo não consiga nada (ex.: socket ainda
      // reconectando naquele instante). Com o cache atualizado, a rede de segurança do socket
      // (useEffect acima) detecta a participação confirmada e entra na sala sozinha assim que a
      // conexão estiver pronta, sem deixar a tela travada esperando por essa chamada específica.
      await refetch();
      await joinRoom();
    },
    [joinBattleMutation, battleId, refetch, joinRoom],
  );

  const joinBattleBot = useCallback(
    async (trainerId?: string) => {
      await joinBattleBotMutation.mutateAsync({ battleId, trainerId });
      // playerA (o humano atual) já está na sala do socket desde que a batalha foi criada —
      // join-bot só preenche o playerB no backend, então basta atualizar o snapshot REST pra
      // pegar o novo status (SELECTING_LEAD) e o participante bot, sem precisar reentrar na sala.
      await refetch();
    },
    [joinBattleBotMutation, battleId, refetch],
  );

  const selectLead = useCallback(
    async (battlePokemonId: string) => {
      try {
        await emitWithAck(socket, "select-lead", { battlePokemonId });
        await refetch();
      } catch (err) {
        errorToast({ description: extractSocketErrorMessage(err) });
        throw err;
      }
    },
    [socket, refetch],
  );

  const ready = useCallback(async () => {
    try {
      await emitWithAck(socket, "ready", {});
      if (myParticipant) {
        setReadyParticipantIds((prev) => new Set(prev).add(myParticipant.id));
      }
    } catch (err) {
      errorToast({ description: extractSocketErrorMessage(err) });
      throw err;
    }
  }, [socket, myParticipant]);

  const submitAction = useCallback(
    async (payload: SubmitActionPayload) => {
      // Troca forçada não avança o turno (só a resolução normal faz isso), então não
      // deve travar o painel de ações via mySubmitted — só o refetch já resolve a UI.
      const isForcedSwitch = myParticipant?.turnState === "WAITING_FORCED_SWITCH";
      try {
        await emitWithAck(socket, "submit-action", payload);
        if (isForcedSwitch) {
          void refetch();
        } else if (battle) {
          setMySubmittedForTurn(battle.turnNumber);
        }
      } catch (err) {
        errorToast({ description: extractSocketErrorMessage(err) });
        throw err;
      }
    },
    [socket, myParticipant, refetch, battle],
  );

  const activeTurnEvent = turnEventQueue[0] ?? null;

  const advanceTurnEvent = useCallback(() => {
    setTurnEventQueue((prev) => prev.slice(1));
  }, []);

  // Marca quando o efeito de HP do evento atualmente em exibição já pode "aparecer" na barra —
  // fica false de novo assim que o próximo evento vira o topo da fila.
  const [headDamageRevealed, setHeadDamageRevealed] = useState(false);
  // eventSeq muda a cada evento novo no topo da fila — usado pelo front pra forçar reinício das
  // animações transitórias (flash de status, seta de stat, +HP de heal) mesmo quando o mesmo tipo
  // de evento se repete em sequência.
  const [eventSeq, setEventSeq] = useState(0);
  // Mesmo padrão de "ajuste de estado durante o render" usado acima pro reset de battleId —
  // evita o efeito extra de só resetar quando activeTurnEvent mudar.
  const [prevActiveTurnEvent, setPrevActiveTurnEvent] = useState<TurnLogEntry | null>(null);
  if (activeTurnEvent !== prevActiveTurnEvent) {
    setPrevActiveTurnEvent(activeTurnEvent);
    if (headDamageRevealed) setHeadDamageRevealed(false);
    setEventSeq((s) => s + 1);
    // O evento "switch" virou o topo da fila — é a partir de agora que o Pokémon substituto deve
    // aparecer (com a animação de entrada), então libera o congelamento feito em handleTurnResolved.
    if (activeTurnEvent?.event === "switch" && activeTurnEvent.participantId in frozenActiveSlot) {
      const participantId = activeTurnEvent.participantId;
      setFrozenActiveSlot((prev) => {
        if (!(participantId in prev)) return prev;
        const next = { ...prev };
        delete next[participantId];
        return next;
      });
    }
  }

  useEffect(() => {
    if (!activeTurnEvent || !getHpEffect(activeTurnEvent)) return;
    // Só revela o efeito depois que a animação de shake (attack-shake, 0.6s x2 = 1.2s) termina.
    const timer = setTimeout(() => setHeadDamageRevealed(true), 1200);
    return () => clearTimeout(timer);
  }, [activeTurnEvent]);

  // Soma quanto o HP de cada Pokémon ainda não deve refletir na barra: o delta (dano positivo ou
  // cura negativa) de todos os eventos que ainda estão na fila, exceto o do topo depois que sua
  // animação já tiver terminado.
  const pendingDamageByPokemon = useMemo(() => {
    const map: Record<string, number> = {};
    turnEventQueue.forEach((entry, idx) => {
      const effect = getHpEffect(entry);
      if (!effect) return;
      if (idx === 0 && headDamageRevealed) return;
      map[effect.battlePokemonId] = (map[effect.battlePokemonId] ?? 0) + effect.delta;
    });
    return map;
  }, [turnEventQueue, headDamageRevealed]);

  const getDisplayHp = useCallback(
    (battlePokemonId: string, actualHp: number, maxHp: number) => {
      const pending = pendingDamageByPokemon[battlePokemonId] ?? 0;
      return Math.max(0, Math.min(maxHp, actualHp + pending));
    },
    [pendingDamageByPokemon],
  );

  const getDisplayActivePokemon = useCallback(
    (participant: IBattleParticipant | null) => {
      if (!participant) return null;
      const slot = frozenActiveSlot[participant.id] ?? participant.activeSlot;
      return participant.pokemons.find((p) => p.position === slot) ?? null;
    },
    [frozenActiveSlot],
  );

  const submitMove = useCallback((moveId: string) => submitAction({ type: "MOVE", moveId }), [submitAction]);
  const submitSwitch = useCallback(
    (targetPokemonId: string) => submitAction({ type: "SWITCH", targetPokemonId }),
    [submitAction],
  );
  const forfeit = useCallback(async () => {
    setIForfeited(true);
    await submitAction({ type: "FORFEIT" });
  }, [submitAction]);

  return (
    <BattleContext.Provider
      value={{
        battle: battle ?? null,
        isLoading,
        isConnected: connected,
        isParticipant,
        currentUserId,
        myParticipant,
        opponentParticipant,
        lastLog,
        activeTurnEvent,
        activeTurnEventSeq: eventSeq,
        advanceTurnEvent,
        getDisplayHp,
        getDisplayActivePokemon,
        mySubmitted,
        opponentSubmitted,
        readyParticipantIds,
        iForfeited,
        createBattle,
        joinBattle,
        joinBattleBot,
        selectLead,
        ready,
        submitMove,
        submitSwitch,
        forfeit,
      }}
    >
      {children}
    </BattleContext.Provider>
  );
};

export const useBattleContext = () => {
  const context = useContext(BattleContext);
  if (!context) {
    throw new Error("useBattleContext must be used within a BattleProvider");
  }
  return context;
};
