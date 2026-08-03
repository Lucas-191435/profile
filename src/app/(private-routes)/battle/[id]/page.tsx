'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useBattleContext } from "@/context/BattleContext";
import { IBattle, IBattleParticipant, StatKey, StatusBlockedReason, StatusCondition, TurnLogEntry } from "@/types/IBattle";
import { LoadingScreen } from "./components/LoadingScreen";
import { PokemonSelectScreen } from "./components/PokemonSelectScreen";
import { WaitingOpponentScreen } from "./components/WaitingOpponentScreen";
import { JoinBattleScreen } from "./components/JoinBattleScreen";
import { BattleResultScreen } from "./components/BattleResultScreen";
import { BattleScene } from "./components/BattleScene";
import { StatusCardEffect } from "./components/StatusCard";
import { BattleDialogPanel } from "./components/BattleDialogPanel";
import { BattleActionsPanel } from "./components/BattleActionsPanel";
import { PokemonModal } from "./components/PokemonModal";
import { BagModal } from "./components/BagModal";
import { ChatModal } from "./components/ChatModal";
import { MenuView, ModalView } from "./components/types";
import { sounds } from "@/utils/sounds";

const TEAM_LABELS: Record<string, string> = {
  teamAlpha: "Alpha",
  teamBeta: "Beta",
  teamGamma: "Gamma",
};

function participantLabel(battle: IBattle, participantId: string, currentUserId?: string): string {
  const participant = battle.participants.find((p) => p.id === participantId);
  if (!participant) return "Alguém";
  return participant.userId === currentUserId ? "Você" : "O oponente";
}

function pokemonNameById(battle: IBattle, battlePokemonId: string): string {
  for (const participant of battle.participants) {
    const pokemon = participant.pokemons.find((p) => p.id === battlePokemonId);
    if (pokemon) return pokemon.myPokemon.nickname || pokemon.myPokemon.pokemon.name;
  }
  return "Pokémon";
}

function moveNameById(battle: IBattle, moveId: string): string {
  for (const participant of battle.participants) {
    for (const pokemon of participant.pokemons) {
      const move = pokemon.moves.find((m) => m.moveId === moveId);
      if (move) return move.move.name;
    }
  }
  return "um golpe";
}

const STATUS_APPLIED_TEXT: Record<Exclude<StatusCondition, "NONE">, string> = {
  PARALYZED: "foi paralisado",
  POISONED: "foi envenenado",
  BURNED: "foi queimado",
  ASLEEP: "adormeceu",
  FROZEN: "foi congelado",
  CONFUSED: "ficou confuso",
};

const STATUS_TICK_TEXT: Record<Exclude<StatusCondition, "NONE">, string> = {
  PARALYZED: "sofreu com a paralisia",
  POISONED: "sofreu com o veneno",
  BURNED: "sofreu com a queimadura",
  ASLEEP: "continua dormindo",
  FROZEN: "está congelado",
  CONFUSED: "está confuso",
};

const STATUS_CURED_TEXT: Record<Exclude<StatusCondition, "NONE">, string> = {
  PARALYZED: "não está mais paralisado",
  POISONED: "não está mais envenenado",
  BURNED: "não está mais queimado",
  ASLEEP: "acordou",
  FROZEN: "descongelou",
  CONFUSED: "não está mais confuso",
};

const STATUS_BLOCKED_TEXT: Record<StatusBlockedReason, string> = {
  asleep: "está dormindo e não conseguiu se mexer",
  paralyzed: "está paralisado e não conseguiu se mexer",
  frozen: "está congelado e não conseguiu se mexer",
  "confused-hit": "está confuso e não conseguiu se concentrar",
};

const STAT_LABELS: Record<StatKey, string> = {
  atk: "Ataque",
  def: "Defesa",
  spAtk: "Ataque Especial",
  spDef: "Defesa Especial",
  speed: "Velocidade",
  accuracy: "Precisão",
  evasion: "Evasão",
};

function describeTurnLog(entry: TurnLogEntry, battle: IBattle, currentUserId?: string): string {
  switch (entry.event) {
    case "switch":
      return `${participantLabel(battle, entry.participantId, currentUserId)} trocou para ${pokemonNameById(battle, entry.battlePokemonId)}!`;
    case "forfeit":
      return `${participantLabel(battle, entry.participantId, currentUserId)} desistiu da batalha!`;
    case "move-failed":
      return entry.reason === "no-pp"
        ? `${participantLabel(battle, entry.participantId, currentUserId)} tentou usar ${moveNameById(battle, entry.moveId)}, mas não tinha PP!`
        : `${participantLabel(battle, entry.participantId, currentUserId)} tentou atacar, mas falhou!`;
    case "move": {
      const attacker = participantLabel(battle, entry.participantId, currentUserId);
      const move = moveNameById(battle, entry.moveId);
      if (entry.missed) return `${attacker} usou ${move}, mas errou!`;
      const target = pokemonNameById(battle, entry.targetBattlePokemonId);
      const effectivenessText =
        entry.effectiveness === "super_effective"
          ? " Foi super efetivo!"
          : entry.effectiveness === "not_very_effective"
          ? " Não foi muito efetivo..."
          : entry.effectiveness === "no_effect"
          ? " Não afetou o Pokémon..."
          : "";
      const critText = entry.critical ? " Acerto crítico!" : "";
      const faintText = entry.targetFainted ? ` ${target} desmaiou!` : "";
      return `${attacker} usou ${move}!${critText}${effectivenessText}${faintText}`;
    }
    case "status-applied": {
      const pokeName = pokemonNameById(battle, entry.battlePokemonId);
      return `${pokeName} ${STATUS_APPLIED_TEXT[entry.statusCondition as Exclude<typeof entry.statusCondition, "NONE">]}!`;
    }
    case "status-blocked": {
      const pokeName = pokemonNameById(battle, entry.battlePokemonId);
      return `${pokeName} ${STATUS_BLOCKED_TEXT[entry.reason]}!`;
    }
    case "confusion-hit": {
      const pokeName = pokemonNameById(battle, entry.battlePokemonId);
      const faintText = entry.targetFainted ? ` ${pokeName} desmaiou!` : "";
      return `${pokeName} se feriu na confusão!${faintText}`;
    }
    case "status-tick": {
      const pokeName = pokemonNameById(battle, entry.battlePokemonId);
      const faintText = entry.targetFainted ? ` ${pokeName} desmaiou!` : "";
      return `${pokeName} ${STATUS_TICK_TEXT[entry.statusCondition as Exclude<typeof entry.statusCondition, "NONE">]}!${faintText}`;
    }
    case "status-cured": {
      const pokeName = pokemonNameById(battle, entry.battlePokemonId);
      return `${pokeName} ${STATUS_CURED_TEXT[entry.statusCondition as Exclude<typeof entry.statusCondition, "NONE">]}!`;
    }
    case "stat-change": {
      const pokeName = pokemonNameById(battle, entry.battlePokemonId);
      const dir = entry.stages > 0 ? "aumentou" : "diminuiu";
      const intensity = Math.abs(entry.stages) >= 2 ? " bastante" : "";
      return `${STAT_LABELS[entry.stat]} de ${pokeName} ${dir}${intensity}!`;
    }
    case "heal": {
      const pokeName = pokemonNameById(battle, entry.battlePokemonId);
      return `${pokeName} recuperou HP!`;
    }
    case "recoil": {
      const pokeName = pokemonNameById(battle, entry.battlePokemonId);
      const faintText = entry.targetFainted ? ` ${pokeName} desmaiou!` : "";
      return `${pokeName} sofreu dano de recuo!${faintText}`;
    }
    case "battle-ended":
      return entry.reason === "forfeit" ? "A batalha terminou por desistência." : "A batalha chegou ao fim!";
  }
}

function sideForBattlePokemon(
  battlePokemonId: string,
  myParticipant: IBattleParticipant | null,
  opponentParticipant: IBattleParticipant | null,
): "me" | "opponent" | null {
  if (myParticipant?.pokemons.some((p) => p.id === battlePokemonId)) return "me";
  if (opponentParticipant?.pokemons.some((p) => p.id === battlePokemonId)) return "opponent";
  return null;
}

function faintedBattlePokemonId(entry: TurnLogEntry): string | null {
  switch (entry.event) {
    case "move":
      return entry.targetFainted ? entry.targetBattlePokemonId : null;
    case "confusion-hit":
    case "status-tick":
    case "recoil":
      return entry.targetFainted ? entry.battlePokemonId : null;
    default:
      return null;
  }
}

function sideEffectsForEvent(
  entry: TurnLogEntry | null,
  myParticipant: IBattleParticipant | null,
  opponentParticipant: IBattleParticipant | null,
): { me: StatusCardEffect | null; opponent: StatusCardEffect | null } {
  if (!entry) return { me: null, opponent: null };

  let battlePokemonId: string | null = null;
  let effect: StatusCardEffect | null = null;

  switch (entry.event) {
    case "status-applied":
      battlePokemonId = entry.battlePokemonId;
      effect = { kind: "status", status: entry.statusCondition, variant: "applied" };
      break;
    case "status-cured":
      battlePokemonId = entry.battlePokemonId;
      effect = { kind: "status", status: entry.statusCondition, variant: "cured" };
      break;
    case "stat-change":
      battlePokemonId = entry.battlePokemonId;
      effect = { kind: "stat", stat: entry.stat, stages: entry.stages };
      break;
    case "heal":
      battlePokemonId = entry.battlePokemonId;
      effect = { kind: "heal", amount: entry.amount };
      break;
    default:
      return { me: null, opponent: null };
  }

  const side = sideForBattlePokemon(battlePokemonId, myParticipant, opponentParticipant);
  if (side === "me") return { me: effect, opponent: null };
  if (side === "opponent") return { me: null, opponent: effect };
  return { me: null, opponent: null };
}

const Batalha = () => {
  const router = useRouter();
  const {
    battle,
    isConnected,
    isParticipant,
    currentUserId,
    myParticipant,
    opponentParticipant,
    activeTurnEvent,
    activeTurnEventSeq,
    advanceTurnEvent,
    getDisplayHp,
    mySubmitted,
    opponentSubmitted,
    readyParticipantIds,
    iForfeited,
    joinBattle,
    selectLead,
    ready,
    submitMove,
    submitSwitch,
    forfeit,
  } = useBattleContext();

  const [menuView, setMenuView] = useState<MenuView>("main");
  const [selectedMoveIdx, setSelectedMoveIdx] = useState<number | null>(null);
  const [modal, setModal] = useState<ModalView>(null);

  const forcedSwitch = myParticipant?.turnState === "WAITING_FORCED_SWITCH";

  // Só abre depois que a fila de eventos do turno terminar de tocar (activeTurnEvent null) —
  // sem isso, o modal aparecia assim que o backend confirmava a troca forçada, ainda no meio da
  // animação/diálogo do golpe que derrubou o Pokémon, antes da barra de HP terminar de zerar.
  useEffect(() => {
    if (forcedSwitch && !activeTurnEvent) setModal("pokemon");
  }, [forcedSwitch, activeTurnEvent]);

  useEffect(() => {
    setMenuView("main");
    setSelectedMoveIdx(null);
  }, [battle?.turnNumber]);

  const myActive = useMemo(
    () => myParticipant?.pokemons.find((p) => p.position === myParticipant.activeSlot) ?? null,
    [myParticipant],
  );
  const opponentActive = useMemo(
    () => opponentParticipant?.pokemons.find((p) => p.position === opponentParticipant.activeSlot) ?? null,
    [opponentParticipant],
  );

  const dialogText = useMemo(() => {
    if (!battle) return "";
    // Enquanto a fila do turno está tocando, o texto acompanha o evento em exibição (na ordem
    // de execução); esvaziada a fila, volta a mostrar o último evento persistido.
    if (activeTurnEvent) return describeTurnLog(activeTurnEvent, battle, currentUserId);
    if (battle.turnLogs.length === 0) return "";
    return describeTurnLog(battle.turnLogs[0].payload, battle, currentUserId);
  }, [battle, activeTurnEvent, currentUserId]);

  // Toca cada evento do turno por um tempo fixo antes de avançar pro próximo — dá tempo da
  // animação de ataque e do texto serem lidos antes de passar pro golpe seguinte.
  useEffect(() => {
    if (!activeTurnEvent) return;
    const timer = setTimeout(() => advanceTurnEvent(), 2200);
    return () => clearTimeout(timer);
  }, [activeTurnEvent, advanceTurnEvent]);

  // Lado que deve "reagir" fisicamente ao evento em exibição: quem ataca (move) ou quem sofre
  // dano de confusão/status/recuo (self-inflicted, mesmo participantId de quem sofre o efeito).
  const shakingSide = useMemo<"me" | "opponent" | null>(() => {
    if (!activeTurnEvent || !myParticipant) return null;
    const isShakeEvent =
      activeTurnEvent.event === "move" ||
      activeTurnEvent.event === "confusion-hit" ||
      activeTurnEvent.event === "status-tick" ||
      activeTurnEvent.event === "recoil";
    if (!isShakeEvent) return null;
    if (activeTurnEvent.event === "move" && activeTurnEvent.missed) return null;
    return activeTurnEvent.participantId === myParticipant.id ? "me" : "opponent";
  }, [activeTurnEvent, myParticipant]);

  // Lado cujo Pokémon desmaiou NESTE evento (dispara a animação de queda uma única vez, no
  // instante em que o evento causador do faint está no topo da fila).
  const faintSide = useMemo<"me" | "opponent" | null>(() => {
    if (!activeTurnEvent) return null;
    const battlePokemonId = faintedBattlePokemonId(activeTurnEvent);
    if (!battlePokemonId) return null;
    return sideForBattlePokemon(battlePokemonId, myParticipant, opponentParticipant);
  }, [activeTurnEvent, myParticipant, opponentParticipant]);

  const { me: myEffect, opponent: opponentEffect } = useMemo(
    () => sideEffectsForEvent(activeTurnEvent, myParticipant, opponentParticipant),
    [activeTurnEvent, myParticipant, opponentParticipant],
  );

  if (!isConnected || (isParticipant && !battle)) {
    return <LoadingScreen />;
  }

  if (!isParticipant) {
    console.log("vendo valor de isParticipant", isParticipant)
    return <JoinBattleScreen onJoin={joinBattle} />;
  }

  if (!battle || !myParticipant) {
    return <LoadingScreen />;
  }

  if (battle.status === "WAITING_OPPONENT") {
    return <WaitingOpponentScreen battleId={battle.id} teamLabel={TEAM_LABELS[myParticipant.teamName] ?? myParticipant.teamName} />;
  }

  if (battle.status === "SELECTING_LEAD") {
    const selectedBattlePokemonId =
      myParticipant.pokemons.find((p) => p.position === myParticipant.activeSlot)?.id ?? null;
    return (
      <PokemonSelectScreen
        teamLabel={TEAM_LABELS[myParticipant.teamName] ?? myParticipant.teamName}
        pokemons={myParticipant.pokemons}
        selectedBattlePokemonId={selectedBattlePokemonId}
        onSelectLead={selectLead}
        isReady={readyParticipantIds.has(myParticipant.id)}
        opponentReady={opponentParticipant ? readyParticipantIds.has(opponentParticipant.id) : false}
        onReady={ready}
        onBack={() => router.push("/")}
      />
    );
  }

  if (battle.status === "FINISHED") {
    return (
      <BattleResultScreen
        didWin={battle.winnerId === currentUserId}
        iForfeited={iForfeited}
        onExit={() => router.push("/")}
      />
    );
  }

  if (!myActive || !opponentActive) {
    return <LoadingScreen />;
  }

  const locked = mySubmitted || myParticipant.turnState !== "WAITING_ACTION";

  const handleUseMove = async () => {
    if (selectedMoveIdx === null) return;
    const move = myActive.moves[selectedMoveIdx];
    if (!move) return;
    try {
      sounds.clickMouse.play()
      await submitMove(move.moveId);
      setMenuView("main");
      setSelectedMoveIdx(null);
    } catch {
      // erro já reportado via toast pelo BattleContext
    }
  };

  const handleSelectSwitchTarget = async (battlePokemonId: string) => {
    try {
      await submitSwitch(battlePokemonId);
    } catch {
      // erro já reportado via toast pelo BattleContext
    } finally {
      setModal(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-4 py-6 sm:px-8 sm:py-10 md:px-16 md:py-16 lg:px-[100px] lg:py-[60px] xl:px-[200px] xl:py-[100px]">
      <BattleScene
        opponentPokemon={{
          ...opponentActive,
          currentHp: getDisplayHp(opponentActive.id, opponentActive.currentHp, opponentActive.maxHp),
        }}
        myPokemon={{ ...myActive, currentHp: getDisplayHp(myActive.id, myActive.currentHp, myActive.maxHp) }}
        shakingSide={shakingSide}
        faintSide={faintSide}
        myEffect={myEffect}
        opponentEffect={opponentEffect}
        effectKey={activeTurnEventSeq}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 border-t-4 border-[#404058]">
        <BattleDialogPanel
          menuView={menuView}
          dialogText={dialogText}
          activePokemonName={myActive.myPokemon.nickname || myActive.myPokemon.pokemon.name}
          moves={myActive.moves}
          selectedMoveIdx={selectedMoveIdx}
          onSelectMove={setSelectedMoveIdx}
        />
        <BattleActionsPanel
          menuView={menuView}
          moves={myActive.moves}
          selectedMoveIdx={selectedMoveIdx}
          locked={locked}
          onOpenAttacks={() =>{ 
             sounds.clickMouse.play();
            setMenuView("attacks")}}
          onOpenBag={() => setModal("bag")}
          onOpenPokemon={() => { 
             sounds.clickMouse.play();setModal("pokemon")}}
          onOpenChat={() => setModal("chat")}
          onBackToMain={() => {
            sounds.clickPastic.play();
            setMenuView("main");
            setSelectedMoveIdx(null);
          }}
          onUseMove={handleUseMove}
        />
      </div>

      {opponentSubmitted && !locked && (
        <p className="text-center font-body text-xs text-muted-foreground py-1">
          O oponente já escolheu a ação dele.
        </p>
      )}

      <PokemonModal
        open={modal === "pokemon"}
        onOpenChange={(o) => !o && setModal(null)}
        pokemons={myParticipant.pokemons}
        activeBattlePokemonId={myActive.id}
        locked={forcedSwitch}
        onSelect={handleSelectSwitchTarget}
      />

      <BagModal open={modal === "bag"} onOpenChange={(o) => !o && setModal(null)} />

      <ChatModal
        open={modal === "chat"}
        onOpenChange={(o) => !o && setModal(null)}
        onSend={() => setModal(null)}
      />

      <button
        onClick={() => void forfeit()}
        className="fixed bottom-4 right-4 font-display text-[10px] tracking-widest text-muted-foreground hover:text-destructive underline"
      >
        Desistir da batalha
      </button>
    </div>
  );
};

export default Batalha;
