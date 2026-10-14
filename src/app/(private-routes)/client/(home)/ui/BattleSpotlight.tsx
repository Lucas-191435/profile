/* eslint-disable @next/next/no-img-element */
'use client';

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Shuffle, Swords, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openBattleDialog } from "@/components/BattleButton";
import { useMyPokemon } from "@/services/queries/useMyPokemon";
import { useCreateBattle, useJoinBattleBot, useTestTrainers } from "@/services/queries/useBattle";
import { useOpenBattleRooms } from "@/hooks/useOpenBattleRooms";
import { TeamName } from "@/types/IBattle";
import { IMyPokemon } from "@/types/IMyPokemon";
import { TRAINERS } from "@/utils/trainers";
import { frontSpriteAnimated } from "@/utils/sprites";
import { errorToast } from "@/utils/toasts";

const TEAM_ORDER: { teamName: TeamName; flag: keyof Pick<IMyPokemon, "teamAlpha" | "teamBeta" | "teamGamma">; label: string }[] = [
  { teamName: "teamAlpha", flag: "teamAlpha", label: "Time Alpha" },
  { teamName: "teamBeta", flag: "teamBeta", label: "Time Beta" },
  { teamName: "teamGamma", flag: "teamGamma", label: "Time Gamma" },
];

// Usadas quando o treinador de teste não tem descrição própria — sorteadas junto com o rival.
const FALLBACK_TAUNTS = [
  "Acha que seu time aguenta três turnos comigo?",
  "Meu time treinou a semana inteira. E o seu?",
  "Ouvi dizer que você é bom. Vamos ver isso na prática.",
  "Escolha bem seu primeiro Pokémon. Você vai precisar.",
  "Ninguém passou por mim hoje. Quer tentar?",
];

function findFirstTeam(myPokemons: IMyPokemon[]) {
  for (const option of TEAM_ORDER) {
    const members = myPokemons.filter((p) => p[option.flag]);
    if (members.length > 0) return { ...option, members };
  }
  return null;
}

export function BattleSpotlight() {
  const router = useRouter();
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const { data: myPokemons } = useMyPokemon({ enabled: true });
  const { data: testTrainers, isLoading: isLoadingTrainers } = useTestTrainers();
  const { count: openRoomsCount } = useOpenBattleRooms();
  const createBattle = useCreateBattle();
  const joinBattleBot = useJoinBattleBot();
  const [revealed, setRevealed] = useState(false);
  // Sorteado a cada visita (e de novo no botão "Outro rival") — um rival fixo deixava de gerar
  // curiosidade. É um contador, não o índice direto, pra funcionar com qualquer tamanho de lista.
  const [rivalPick, setRivalPick] = useState(() => Math.floor(Math.random() * 1_000_000));
  const [isChallenging, setIsChallenging] = useState(false);

  // Primeiro time com algum Pokémon (Alpha > Beta > Gamma) — é com ele que o desafio rápido começa.
  const team = useMemo(() => findFirstTeam(myPokemons ?? []), [myPokemons]);

  const candidates = useMemo(
    () => (testTrainers ?? []).filter((t) => t.id !== currentUserId),
    [testTrainers, currentUserId],
  );

  const rival = useMemo(() => {
    if (candidates.length === 0) return null;
    const trainer = candidates[rivalPick % candidates.length];
    const avatar = TRAINERS.find((t) => t.id === trainer.avatar) ?? TRAINERS[0];
    const taunt = trainer.description?.trim() || FALLBACK_TAUNTS[rivalPick % FALLBACK_TAUNTS.length];
    return { id: trainer.id, name: trainer.name, avatarUrl: avatar.url, taunt };
  }, [candidates, rivalPick]);

  // Pula pelo menos 1 posição, então o próximo rival nunca é o mesmo (quando há mais de um).
  const handleRerollRival = () => {
    setRivalPick((pick) => pick + 1 + Math.floor(Math.random() * Math.max(1, candidates.length - 1)));
    setRevealed(false);
  };

  const handleChallenge = async () => {
    if (!team || !rival) return;
    setIsChallenging(true);
    let battleId: string | null = null;
    try {
      ({ id: battleId } = await createBattle.mutateAsync({ teamName: team.teamName }));
      await joinBattleBot.mutateAsync({ battleId, trainerId: rival.id });
      router.push(`/battle/${battleId}`);
    } catch {
      // Se a sala chegou a ser criada, leva pra ela mesmo assim — dá pra chamar o bot de lá.
      if (battleId) {
        router.push(`/battle/${battleId}`);
      } else {
        errorToast({ description: "Não foi possível iniciar o desafio. Tente de novo." });
        setIsChallenging(false);
      }
    }
  };

  const lead = team?.members[0];
  const benched = team?.members.slice(1, 6) ?? [];

  return (
    <section
      data-tour="home-battle"
      className="relative overflow-hidden rounded-2xl border-2 border-primary/40 bg-card w-full max-w-[1800px] mx-auto"
    >
      {/* Fundo: metade vermelha (você) x metade azul (rival), separadas na diagonal. */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-transparent" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-tl from-[#3858a0]/35 via-transparent to-transparent" />
      <div aria-hidden className="absolute -inset-y-10 left-1/2 w-1 -translate-x-1/2 rotate-12 bg-white/10" />

      <div className="relative p-4 sm:p-6 md:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 font-display text-[10px] sm:text-xs tracking-widest text-primary-foreground">
            <Swords className="size-3.5" />
            UM RIVAL APARECEU!
          </span>
          {candidates.length > 1 && (
            <button
              type="button"
              onClick={handleRerollRival}
              disabled={isChallenging}
              aria-label="Sortear outro rival"
              className="order-last sm:order-none inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1 font-body text-[11px] sm:text-xs hover:border-primary/60 transition-colors disabled:opacity-50"
            >
              <Shuffle className="size-3.5" />
              Outro rival
            </button>
          )}
          {openRoomsCount > 0 && (
            <button
              type="button"
              onClick={() => openBattleDialog("join")}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1 font-body text-[11px] sm:text-xs hover:border-primary/60 transition-colors"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-green-500" />
              </span>
              {openRoomsCount === 1 ? "1 jogador esperando desafiante" : `${openRoomsCount} jogadores esperando desafiante`}
            </button>
          )}
        </div>

        {/* Confronto: seu time | VS | rival. Mesma grade no mobile, só muda o tamanho dos sprites. */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-6">
          <div className="flex flex-col items-center text-center gap-1 min-w-0">
            {lead ? (
              <>
                <img
                  src={frontSpriteAnimated(lead.pokemon.pokeId)}
                  alt={lead.nickname || lead.pokemon.name}
                  // Espelhado pra "olhar" na direção do rival.
                  className="h-16 w-16 sm:h-24 sm:w-24 md:h-28 md:w-28 object-contain -scale-x-100 animate-float motion-reduce:animate-none"
                  style={{ imageRendering: "pixelated" }}
                />
                {benched.length > 0 && (
                  <div className="flex flex-wrap justify-center -space-x-1">
                    {benched.map((p) => (
                      <img
                        key={p.id}
                        src={p.pokemon.img1}
                        alt={p.nickname || p.pokemon.name}
                        className="h-7 w-7 sm:h-9 sm:w-9 object-contain rounded-full bg-background/50 border border-border/40"
                      />
                    ))}
                  </div>
                )}
                <span className="font-display text-[10px] sm:text-xs tracking-wider text-muted-foreground truncate max-w-full">
                  {team?.label.toUpperCase()}
                </span>
              </>
            ) : (
              <>
                <div className="h-16 w-16 sm:h-24 sm:w-24 rounded-full border-2 border-dashed border-border flex items-center justify-center font-display text-2xl text-muted-foreground">
                  ?
                </div>
                <span className="font-display text-[10px] sm:text-xs tracking-wider text-muted-foreground">SEM TIME</span>
              </>
            )}
          </div>

          <span
            aria-hidden
            className="font-display text-3xl sm:text-5xl md:text-6xl font-black italic text-primary text-glow animate-vs-pulse motion-reduce:animate-none"
          >
            VS
          </span>

          {/* Rival começa em silhueta — passar o mouse (ou tocar, no celular) revela quem é. */}
          <button
            type="button"
            onClick={() => setRevealed(true)}
            onMouseEnter={() => setRevealed(true)}
            onFocus={() => setRevealed(true)}
            disabled={!rival}
            className="flex flex-col items-center text-center gap-1 min-w-0 rounded-xl p-1 focus-visible:outline-2 focus-visible:outline-primary"
            aria-label={rival ? (revealed ? `Rival: ${rival.name}` : "Revelar o rival do dia") : "Rival indisponível"}
          >
            {isLoadingTrainers ? (
              <Loader2 className="h-16 w-16 sm:h-24 sm:w-24 p-5 animate-spin text-muted-foreground" />
            ) : (
              <img
                src={rival?.avatarUrl ?? TRAINERS[0].url}
                alt=""
                className={`h-20 w-20 sm:h-28 sm:w-28 md:h-32 md:w-32 object-contain transition-[filter] duration-500 ${
                  revealed && rival ? "" : "brightness-0 opacity-80"
                }`}
              />
            )}
            <span className="font-display text-xs sm:text-sm tracking-wider truncate max-w-full">
              {revealed && rival ? rival.name : "???"}
            </span>
            {/* O time do rival fica em segredo até a batalha. */}
            <span className="flex gap-1" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="flex size-4 sm:size-5 items-center justify-center rounded-full border border-border bg-background/70 font-display text-[8px] sm:text-[10px] text-muted-foreground"
                >
                  ?
                </span>
              ))}
            </span>
          </button>
        </div>

        {rival && (
          <p className="text-center font-body text-sm sm:text-base italic text-muted-foreground line-clamp-2 max-w-xl mx-auto">
            “{revealed ? rival.taunt : "Um treinador quer te desafiar..."}”
          </p>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-center gap-2">
          {team ? (
            <Button
              onClick={() => void handleChallenge()}
              disabled={!rival || isChallenging}
              size="lg"
              className="w-full sm:w-auto sm:min-w-56 font-display tracking-wider gap-2 glow-red"
            >
              {isChallenging ? <Loader2 className="size-4 animate-spin" /> : <Swords className="size-4" />}
              {isChallenging ? "Preparando a arena..." : revealed && rival ? `Desafiar ${rival.name}` : "Aceitar o desafio"}
            </Button>
          ) : (
            <Button asChild size="lg" className="w-full sm:w-auto sm:min-w-56 font-display tracking-wider">
              <Link href="/client/my-pokemon">Montar meu time</Link>
            </Button>
          )}
          <Button
            variant="outline"
            size="lg"
            onClick={() => openBattleDialog()}
            className="w-full sm:w-auto font-display tracking-wider gap-2"
          >
            <Users className="size-4" />
            Batalhar com um amigo
          </Button>
        </div>
      </div>
    </section>
  );
}
