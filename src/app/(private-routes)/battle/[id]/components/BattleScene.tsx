/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { IBattlePokemon } from "@/types/IBattle";
import { backSpriteAnimated, frontSpriteAnimated } from "@/utils/sprites";
import { PlaybackStep, Side } from "../lib/battlePlayback";
import { StatusCard } from "./StatusCard";

const FIXED_LEVEL = 50;

const ACTION_CLASSES = ["animate-attack-lunge", "animate-hit-react"];

// Avanço do atacante / reação do alvo ficam num wrapper em volta do <img>: o próprio <img> já usa
// `animation` pra entrada (sprite-enter) e desmaio (faint-drop), e duas animações no mesmo
// elemento disputam o shorthand. A classe é recolocada via classList a cada etapa (`stepKey`) pra
// reiniciar a animação mesmo quando duas etapas seguidas animam o mesmo lado.
function useActionAnimation(className: string | null, delayMs: number, stepKey: number | undefined) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove(...ACTION_CLASSES);
    if (!className) return;
    el.style.animationDelay = `${delayMs}ms`;
    void el.offsetWidth;
    el.classList.add(className);
  }, [className, delayMs, stepKey]);

  return ref;
}

function actionClassFor(side: Side, step: PlaybackStep | null): { className: string | null; delayMs: number } {
  if (step?.hitSide === side) return { className: "animate-hit-react", delayMs: step.hitDelayMs ?? 0 };
  if (step?.lungeSide === side) return { className: "animate-attack-lunge", delayMs: 0 };
  return { className: null, delayMs: 0 };
}

// Desmaiado: some de vez depois da queda (fica o espaço vazio até o substituto entrar).
function spriteStateClass(pokemon: IBattlePokemon, side: Side, step: PlaybackStep | null): string {
  if (step?.faintSide === side) return "animate-faint-drop";
  return pokemon.fainted ? "opacity-0" : "";
}

interface BattleSceneProps {
  opponentPokemon: IBattlePokemon;
  myPokemon: IBattlePokemon;
  // Time completo de cada treinador (na ordem de `position`) — usado só pra desenhar a fileira de
  // pokebolas indicando quantos Pokémon de cada lado já desmaiaram.
  opponentTeam?: IBattlePokemon[];
  myTeam?: IBattlePokemon[];
  // Etapa da playback em exibição — decide quem avança, quem reage, quem cai e o que flutua.
  step: PlaybackStep | null;
  stepKey?: number;
  opponentIsBot?: boolean;
}

export function BattleScene({ opponentPokemon, myPokemon, opponentTeam, myTeam, step, stepKey, opponentIsBot }: BattleSceneProps) {
  const opponentName = opponentPokemon.myPokemon.nickname || opponentPokemon.myPokemon.pokemon.name;
  const myName = myPokemon.myPokemon.nickname || myPokemon.myPokemon.pokemon.name;

  const opponentAction = actionClassFor("opponent", step);
  const myAction = actionClassFor("me", step);
  const opponentActionRef = useActionAnimation(opponentAction.className, opponentAction.delayMs, stepKey);
  const myActionRef = useActionAnimation(myAction.className, myAction.delayMs, stepKey);

  const opponentEffect = step?.cardEffect?.side === "opponent" ? step.cardEffect.effect : null;
  const myEffect = step?.cardEffect?.side === "me" ? step.cardEffect.effect : null;

  return (
    <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-[#f8f8e0] via-[#e8e8c8] to-[#d8d8b8]">
      <div className="absolute top-[38%] right-[8%] w-56 h-16 rounded-full bg-black/10 blur-md" />
      <div className="absolute bottom-[22%] left-[8%] w-64 h-20 rounded-full bg-black/10 blur-md" />

      {/* Opponent status - TOP LEFT */}
      <div className="absolute top-6 left-6 md:left-10">
        <StatusCard
          // Remonta na troca pra barra não "animar" do HP do Pokémon anterior pro do novo.
          key={opponentPokemon.id}
          name={opponentName}
          level={FIXED_LEVEL}
          hpCurrent={opponentPokemon.currentHp}
          hpMax={opponentPokemon.maxHp}
          align="left"
          statusCondition={opponentPokemon.statusCondition}
          statStages={opponentPokemon.statStages}
          effect={opponentEffect}
          effectKey={stepKey}
          isBot={opponentIsBot}
          team={opponentTeam && [...opponentTeam].sort((a, b) => a.position - b.position)}
        />
      </div>

      {/* Opponent sprite - TOP RIGHT */}
      <div className="absolute top-16 right-8 md:right-24">
        <div ref={opponentActionRef} style={{ "--lunge-x": "-28px", "--lunge-y": "18px" } as React.CSSProperties}>
          <img
            // Remonta (e reinicia a animação de entrada) sempre que o Pokémon ativo desse lado
            // muda — troca voluntária, troca forçada por faint, ou o primeiro envio a campo.
            key={opponentPokemon.id}
            src={frontSpriteAnimated(opponentPokemon.myPokemon.pokemon.pokeId)}
            alt={opponentName}
            className={`w-32 h-32 md:w-44 md:h-44 object-contain drop-shadow-lg animate-sprite-enter ${spriteStateClass(
              opponentPokemon,
              "opponent",
              step,
            )}`}
            style={{ imageRendering: "pixelated" }}
          />
        </div>
      </div>

      {/* Player sprite - BOTTOM LEFT */}
      <div className="absolute bottom-10 left-8 md:left-24">
        <div ref={myActionRef} style={{ "--lunge-x": "28px", "--lunge-y": "-18px" } as React.CSSProperties}>
          <img
            key={myPokemon.id}
            src={backSpriteAnimated(myPokemon.myPokemon.pokemon.pokeId)}
            alt={myName}
            className={`w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-lg animate-sprite-enter ${spriteStateClass(
              myPokemon,
              "me",
              step,
            )}`}
            style={{ imageRendering: "pixelated" }}
          />
        </div>
      </div>

      {/* Player status - BOTTOM RIGHT */}
      <div className="absolute bottom-8 right-6 md:right-10">
        <StatusCard
          key={myPokemon.id}
          name={myName}
          level={FIXED_LEVEL}
          hpCurrent={myPokemon.currentHp}
          hpMax={myPokemon.maxHp}
          showHpNumbers
          align="right"
          statusCondition={myPokemon.statusCondition}
          statStages={myPokemon.statStages}
          effect={myEffect}
          effectKey={stepKey}
          team={myTeam && [...myTeam].sort((a, b) => a.position - b.position)}
        />
      </div>
    </div>
  );
}
