'use client';

import { useEffect, useMemo, useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBattleContext } from "@/context/BattleContext";
import { IBattleParticipant } from "@/types/IBattle";
import { LoadingScreen } from "./components/LoadingScreen";
import { PokemonSelectScreen } from "./components/PokemonSelectScreen";
import { WaitingOpponentScreen } from "./components/WaitingOpponentScreen";
import { JoinBattleScreen } from "./components/JoinBattleScreen";
import { BattleResultScreen } from "./components/BattleResultScreen";
import { BattleScene } from "./components/BattleScene";
import { BattleDialogPanel } from "./components/BattleDialogPanel";
import { BattleActionsPanel } from "./components/BattleActionsPanel";
import { BattleLogPanel } from "./components/BattleLogPanel";
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

function activePokemonOf(participant: IBattleParticipant | undefined) {
  return participant?.pokemons.find((p) => p.position === participant.activeSlot) ?? null;
}

const Batalha = () => {
  const router = useRouter();
  const {
    battle,
    displayBattle,
    isConnected,
    isParticipant,
    currentUserId,
    myParticipant,
    opponentParticipant,
    isPlayingTurn,
    activeStep,
    activeStepSeq,
    skipStep,
    playbackFromTurn,
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

  // Só abre depois que a playback do turno terminar — sem isso, o modal aparecia no meio da
  // narração do golpe que derrubou o Pokémon, antes da barra de HP terminar de zerar.
  useEffect(() => {
    if (forcedSwitch && !isPlayingTurn) setModal("pokemon");
  }, [forcedSwitch, isPlayingTurn]);

  useEffect(() => {
    setMenuView("main");
    setSelectedMoveIdx(null);
  }, [battle?.turnNumber]);

  // A cena sempre desenha o estado EXIBIDO (snapshot de antes do turno + etapas já tocadas), nunca
  // o snapshot final direto — é isso que impede o desmaio/status/troca de aparecer antes da hora.
  const myDisplayParticipant = useMemo(
    () => displayBattle?.participants.find((p) => p.id === myParticipant?.id),
    [displayBattle, myParticipant?.id],
  );
  const opponentDisplayParticipant = useMemo(
    () => displayBattle?.participants.find((p) => p.id === opponentParticipant?.id),
    [displayBattle, opponentParticipant?.id],
  );
  const myActive = activePokemonOf(myDisplayParticipant);
  const opponentActive = activePokemonOf(opponentDisplayParticipant);
  // Golpes/PP vêm do snapshot real (o menu só abre fora da playback, quando os dois coincidem).
  const myLiveActive = activePokemonOf(myParticipant ?? undefined);

  if (!isConnected || (isParticipant && !battle)) {
    return <LoadingScreen />;
  }

  if (!isParticipant) {
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

  // O snapshot já chega FINISHED junto com o turno final — segura o resultado até o último golpe,
  // o desmaio e o "Você venceu/perdeu" terminarem de tocar.
  if (battle.status === "FINISHED" && !isPlayingTurn) {
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

  const moves = (myLiveActive ?? myActive).moves;
  const locked = isPlayingTurn || mySubmitted || myParticipant.turnState !== "WAITING_ACTION";

  const handleUseMove = async () => {
    if (selectedMoveIdx === null) return;
    const move = moves[selectedMoveIdx];
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
    <div className="h-screen bg-background flex overflow-hidden">
      <div className="flex-1 min-w-0 overflow-y-auto flex flex-col px-4 pt-6 pb-14 sm:px-8 sm:py-10 md:px-16 md:py-16 lg:px-[100px] lg:py-[60px] xl:px-[200px] xl:py-[100px]">
        <BattleScene
          opponentPokemon={opponentActive}
          myPokemon={myActive}
          opponentTeam={opponentDisplayParticipant?.pokemons}
          myTeam={myDisplayParticipant?.pokemons}
          step={activeStep}
          stepKey={activeStepSeq}
          opponentIsBot={opponentParticipant?.isBot}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 border-t-4 border-[#404058]">
          <BattleDialogPanel
            menuView={isPlayingTurn ? "main" : menuView}
            dialogText={activeStep?.text ?? ""}
            activePokemonName={myActive.myPokemon.nickname || myActive.myPokemon.pokemon.name}
            moves={moves}
            selectedMoveIdx={selectedMoveIdx}
            onSelectMove={setSelectedMoveIdx}
            onAdvance={activeStep ? skipStep : undefined}
          />
          <BattleActionsPanel
            menuView={isPlayingTurn ? "main" : menuView}
            moves={moves}
            selectedMoveIdx={selectedMoveIdx}
            locked={locked}
            lockedMessage={isPlayingTurn ? null : "AGUARDANDO O TURNO SER RESOLVIDO..."}
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
          activeBattlePokemonId={myLiveActive?.id ?? myActive.id}
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
          className="fixed bottom-4 right-4 z-20 flex items-center gap-1.5 rounded-full border-2 border-red-900 bg-red-200 hover:bg-red-300 px-3 py-1.5 font-display text-[10px] sm:text-[11px] font-bold tracking-widest text-red-900 shadow-[3px_3px_0_rgba(0,0,0,0.35)] transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Desistir da batalha
        </button>
      </div>

      <BattleLogPanel
        battle={battle}
        myParticipantId={myParticipant.id}
        hideFromTurn={playbackFromTurn}
      />
    </div>
  );
};

export default Batalha;
