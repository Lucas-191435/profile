/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { IBattlePokemon } from "@/types/IBattle";
import { backSprite, backSpriteAnimated, frontSprite, frontSpriteAnimated } from "@/utils/sprites";
import { StatusCard, StatusCardEffect } from "./StatusCard";

const FIXED_LEVEL = 50;

// Reinicia animate-attack-shake via classList em vez de depender só da className do React: quando
// dois eventos seguidos da fila sacodem o MESMO lado (ex.: move com recuo, dois status-tick em
// sequência), shakingSide não muda entre renders e o React nunca tira/põe a classe — sem isso o
// navegador não reinicia a animação CSS para o segundo evento.
function useAttackShake(active: boolean, effectKey: number | undefined) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    el.classList.remove("animate-attack-shake");
    void el.offsetWidth;
    el.classList.add("animate-attack-shake");
  }, [active, effectKey]);

  return ref;
}

interface BattleSceneProps {
  opponentPokemon: IBattlePokemon;
  myPokemon: IBattlePokemon;
  // Lado cujo sprite deve "reagir" ao evento em exibição (ataque, dano de confusão/status/recuo).
  shakingSide?: "me" | "opponent" | null;
  // Lado cujo Pokémon desmaiou NESTE evento — dispara a animação de queda uma única vez.
  faintSide?: "me" | "opponent" | null;
  opponentEffect?: StatusCardEffect | null;
  myEffect?: StatusCardEffect | null;
  effectKey?: number;
  opponentIsBot?: boolean;
}

export function BattleScene({
  opponentPokemon,
  myPokemon,
  shakingSide,
  faintSide,
  opponentEffect,
  myEffect,
  effectKey,
  opponentIsBot,
}: BattleSceneProps) {
  const opponentName = opponentPokemon.myPokemon.nickname || opponentPokemon.myPokemon.pokemon.name;
  const myName = myPokemon.myPokemon.nickname || myPokemon.myPokemon.pokemon.name;

  const opponentShakeRef = useAttackShake(shakingSide === "opponent", effectKey);
  const myShakeRef = useAttackShake(shakingSide === "me", effectKey);

  return (
    <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-[#f8f8e0] via-[#e8e8c8] to-[#d8d8b8]">
      <div className="absolute top-[38%] right-[8%] w-56 h-16 rounded-full bg-black/10 blur-md" />
      <div className="absolute bottom-[22%] left-[8%] w-64 h-20 rounded-full bg-black/10 blur-md" />

      {/* Opponent status - TOP LEFT */}
      <div className="absolute top-6 left-6 md:left-10">
        <StatusCard
          name={opponentName}
          level={FIXED_LEVEL}
          hpCurrent={opponentPokemon.currentHp}
          hpMax={opponentPokemon.maxHp}
          align="left"
          statusCondition={opponentPokemon.statusCondition}
          effect={opponentEffect}
          effectKey={effectKey}
          isBot={opponentIsBot}
        />
      </div>

      {/* Opponent sprite - TOP RIGHT */}
      <div className="absolute top-16 right-8 md:right-24">
        <img
          // Remonta (e reinicia a animação de entrada) sempre que o Pokémon ativo desse lado
          // muda — troca voluntária, troca forçada por faint, ou o primeiro envio a campo.
          key={opponentPokemon.id}
          ref={opponentShakeRef}
          src={frontSpriteAnimated(opponentPokemon.myPokemon.pokemon.pokeId)}
          alt={opponentName}
          className={`w-32 h-32 md:w-44 md:h-44 object-contain drop-shadow-lg animate-sprite-enter ${
            opponentPokemon.fainted ? "grayscale opacity-40" : ""
          } ${faintSide === "opponent" ? "animate-faint-drop" : ""}`}
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      {/* Player sprite - BOTTOM LEFT */}
      <div className="absolute bottom-10 left-8 md:left-24">
        <img
          key={myPokemon.id}
          ref={myShakeRef}
          src={backSpriteAnimated(myPokemon.myPokemon.pokemon.pokeId)}
          alt={myName}
          className={`w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-lg animate-sprite-enter ${
            myPokemon.fainted ? "grayscale opacity-40" : ""
          } ${faintSide === "me" ? "animate-faint-drop" : ""}`}
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      {/* Player status - BOTTOM RIGHT */}
      <div className="absolute bottom-8 right-6 md:right-10">
        <StatusCard
          name={myName}
          level={FIXED_LEVEL}
          hpCurrent={myPokemon.currentHp}
          hpMax={myPokemon.maxHp}
          showHpNumbers
          align="right"
          statusCondition={myPokemon.statusCondition}
          effect={myEffect}
          effectKey={effectKey}
        />
      </div>
    </div>
  );
}
