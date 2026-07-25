'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMyPokemonContext } from "@/context/MyPokemonContext";
import { useGetPokemons } from "@/services/queries/usePokemon";
import { TeamSlot } from "@/types/IMyPokemon";
import { IPokemon } from "@/types/IPokemon";
import { LoadingScreen } from "./components/LoadingScreen";
import { PokemonSelectScreen } from "./components/PokemonSelectScreen";
import { BattleScene } from "./components/BattleScene";
import { BattleDialogPanel } from "./components/BattleDialogPanel";
import { BattleActionsPanel } from "./components/BattleActionsPanel";
import { PokemonModal } from "./components/PokemonModal";
import { BagModal } from "./components/BagModal";
import { ChatModal } from "./components/ChatModal";
import { MenuView, ModalView, Phase } from "./components/types";

const TEAM_SIZE = 6;

const TEAM_LABELS: Record<string, string> = {
  teamAlpha: "Alpha",
  teamBeta: "Beta",
  teamGamma: "Gamma",
};

const Batalha = () => {
  const router = useRouter();
  const { pokemons, isLoading, teamSelected } = useMyPokemonContext();
  const { data: pokedex } = useGetPokemons({ page: 1, pageSize: 50 });

  const [phase, setPhase] = useState<Phase>("loading");
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [menuView, setMenuView] = useState<MenuView>("main");
  const [selectedMoveIdx, setSelectedMoveIdx] = useState<number | null>(null);
  const [modal, setModal] = useState<ModalView>(null);
  const [dialogText, setDialogText] = useState("");

  const slots = useMemo<TeamSlot[]>(() => {
    if (!pokemons) return [];
    const teamKey = teamSelected as "teamAlpha" | "teamBeta" | "teamGamma";
    const teamMoveKey = `${teamSelected}Move` as "teamAlphaMove" | "teamBetaMove" | "teamGammaMove";
    const filled = pokemons
      .filter((p) => p[teamKey])
      .map((p) => ({ pokemonId: p.id, moves: p[teamMoveKey] ?? [] }));
    return [
      ...filled,
      ...Array.from({ length: Math.max(0, TEAM_SIZE - filled.length) }, () => ({
        pokemonId: null,
        moves: [],
      })),
    ];
  }, [pokemons, teamSelected]);

  const [opponent, setOpponent] = useState<IPokemon | null>(null);

  useEffect(() => {
    if (!pokedex?.pokemon.length || opponent) return;
    const random = pokedex.pokemon[Math.floor(Math.random() * pokedex.pokemon.length)];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpponent(random);
  }, [pokedex, opponent]);

  useEffect(() => {
    if (isLoading) return;
    if (!slots.some((s) => s.pokemonId !== null)) {
      router.push("/meu-pokemon");
      return;
    }
    const timer = setTimeout(() => setPhase("select"), 1800);
    return () => clearTimeout(timer);
  }, [isLoading, slots, router]);

  const getPokemon = (id: string | null) =>
    id ? pokemons?.find((p) => p.id === id) ?? null : null;

  const activePokemon = selectedSlot !== null ? getPokemon(slots[selectedSlot]?.pokemonId ?? null) : null;
  const activeMoves = selectedSlot !== null ? slots[selectedSlot]?.moves ?? [] : [];

  useEffect(() => {
    if (phase === "battle" && activePokemon) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDialogText(`Vai lá, ${activePokemon.nickname || activePokemon.pokemon.name}!`);
    }
  }, [phase, activePokemon]);

  const startBattle = () => {
    if (selectedSlot === null) return;
    setPhase("battle");
  };

  const goBackToMain = () => {
    setMenuView("main");
    setSelectedMoveIdx(null);
  };

  if (phase === "loading") {
    return <LoadingScreen />;
  }

  if (phase === "select") {
    return (
      <PokemonSelectScreen
        teamLabel={TEAM_LABELS[teamSelected] ?? teamSelected}
        slots={slots}
        getPokemon={getPokemon}
        selectedSlot={selectedSlot}
        onSelectSlot={setSelectedSlot}
        ready={ready}
        onReadyChange={setReady}
        onStart={startBattle}
        onBack={() => router.push("/")}
      />
    );
  }

  if (!activePokemon || !opponent) return null;

  const moves = activeMoves.length ? activeMoves : ["Tackle", "—", "—", "—"];
  const activePokemonName = activePokemon.nickname || activePokemon.pokemon.name;

  return (
    <div className="min-h-screen bg-background flex flex-col px-[300px] py-[100px]">
      <BattleScene opponent={opponent} activePokemon={activePokemon} />

      <div className="grid grid-cols-1 md:grid-cols-2 border-t-4 border-[#404058]">
        <BattleDialogPanel
          menuView={menuView}
          dialogText={dialogText}
          activePokemonName={activePokemonName}
          moves={moves}
          selectedMoveIdx={selectedMoveIdx}
          onSelectMove={setSelectedMoveIdx}
        />
        <BattleActionsPanel
          menuView={menuView}
          moves={moves}
          selectedMoveIdx={selectedMoveIdx}
          onOpenAttacks={() => setMenuView("attacks")}
          onOpenBag={() => setModal("bag")}
          onOpenPokemon={() => setModal("pokemon")}
          onOpenChat={() => setModal("chat")}
          onBackToMain={goBackToMain}
          onUseMove={() => {
            if (selectedMoveIdx === null) return;
            const m = moves[selectedMoveIdx];
            setDialogText(`${activePokemonName} usou ${m}!`);
            goBackToMain();
          }}
        />
      </div>

      <PokemonModal
        open={modal === "pokemon"}
        onOpenChange={(o) => !o && setModal(null)}
        slots={slots}
        getPokemon={getPokemon}
        selectedSlot={selectedSlot}
        onSelect={(idx, p) => {
          setSelectedSlot(idx);
          setDialogText(`Vai lá, ${p.nickname || p.pokemon.name}!`);
          setModal(null);
        }}
      />

      <BagModal
        modal={modal}
        onOpenChange={(o) => !o && setModal(null)}
        onOpenBagView={setModal}
        onUseItem={(text) => {
          setDialogText(text);
          setModal(null);
        }}
      />

      <ChatModal
        open={modal === "chat"}
        onOpenChange={(o) => !o && setModal(null)}
        onSend={(text) => {
          setDialogText(`Você: "${text}"`);
          setModal(null);
        }}
      />
    </div>
  );
};

export default Batalha;
