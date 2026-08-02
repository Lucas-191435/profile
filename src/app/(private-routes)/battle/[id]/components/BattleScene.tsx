/* eslint-disable @next/next/no-img-element */
import { IBattlePokemon } from "@/types/IBattle";
import { backSprite, backSpriteAnimated, frontSprite, frontSpriteAnimated } from "@/utils/sprites";
import { StatusCard } from "./StatusCard";

const FIXED_LEVEL = 50;

interface BattleSceneProps {
  opponentPokemon: IBattlePokemon;
  myPokemon: IBattlePokemon;
  attackingSide?: "me" | "opponent" | null;
}

export function BattleScene({ opponentPokemon, myPokemon, attackingSide }: BattleSceneProps) {
  const opponentName = opponentPokemon.myPokemon.nickname || opponentPokemon.myPokemon.pokemon.name;
  const myName = myPokemon.myPokemon.nickname || myPokemon.myPokemon.pokemon.name;

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
        />
      </div>

      {/* Opponent sprite - TOP RIGHT */}
      <div className="absolute top-16 right-8 md:right-24">
        <img
          src={frontSpriteAnimated(opponentPokemon.myPokemon.pokemon.pokeId)}
          alt={opponentName}
          className={`w-32 h-32 md:w-44 md:h-44 object-contain drop-shadow-lg ${
            opponentPokemon.fainted ? "grayscale opacity-40" : ""
          } ${attackingSide === "opponent" ? "animate-attack-shake" : ""}`}
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      {/* Player sprite - BOTTOM LEFT */}
      <div className="absolute bottom-10 left-8 md:left-24">
        <img
          src={backSpriteAnimated(myPokemon.myPokemon.pokemon.pokeId)}
          alt={myName}
          className={`w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-lg ${
            myPokemon.fainted ? "grayscale opacity-40" : ""
          } ${attackingSide === "me" ? "animate-attack-shake" : ""}`}
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
        />
      </div>
    </div>
  );
}
