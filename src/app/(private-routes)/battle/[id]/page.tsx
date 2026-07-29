'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useBattleContext } from "@/context/BattleContext";
import { IBattle, TurnLogEntry } from "@/types/IBattle";
import { LoadingScreen } from "./components/LoadingScreen";
import { PokemonSelectScreen } from "./components/PokemonSelectScreen";
import { WaitingOpponentScreen } from "./components/WaitingOpponentScreen";
import { JoinBattleScreen } from "./components/JoinBattleScreen";
import { BattleResultScreen } from "./components/BattleResultScreen";
import { BattleScene } from "./components/BattleScene";
import { BattleDialogPanel } from "./components/BattleDialogPanel";
import { BattleActionsPanel } from "./components/BattleActionsPanel";
import { PokemonModal } from "./components/PokemonModal";
import { BagModal } from "./components/BagModal";
import { ChatModal } from "./components/ChatModal";
import { MenuView, ModalView } from "./components/types";

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
    case "battle-ended":
      return entry.reason === "forfeit" ? "A batalha terminou por desistência." : "A batalha chegou ao fim!";
  }
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

  useEffect(() => {
    if (forcedSwitch) setModal("pokemon");
  }, [forcedSwitch]);

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
    if (!battle || battle.turnLogs.length === 0) return "";
    return describeTurnLog(battle.turnLogs[0].payload, battle, currentUserId);
  }, [battle, currentUserId]);

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
    <div className="min-h-screen bg-background flex flex-col px-[200px] py-[100px]">
      <BattleScene opponentPokemon={opponentActive} myPokemon={myActive} />

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
          onOpenAttacks={() => setMenuView("attacks")}
          onOpenBag={() => setModal("bag")}
          onOpenPokemon={() => setModal("pokemon")}
          onOpenChat={() => setModal("chat")}
          onBackToMain={() => {
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
