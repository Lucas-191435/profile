/* eslint-disable @next/next/no-img-element */
import { IMyPokemon } from "@/types/IMyPokemon";
import { IPokemon } from "@/types/IPokemon";
import { backSprite, frontSprite } from "@/utils/sprites";
import { StatusCard } from "./StatusCard";

interface BattleSceneProps {
  opponent: IPokemon;
  activePokemon: IMyPokemon;
}

export function BattleScene({ opponent, activePokemon }: BattleSceneProps) {
  return (
    <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-[#f8f8e0] via-[#e8e8c8] to-[#d8d8b8]">
      <div className="absolute top-[38%] right-[8%] w-56 h-16 rounded-full bg-black/10 blur-md" />
      <div className="absolute bottom-[22%] left-[8%] w-64 h-20 rounded-full bg-black/10 blur-md" />

      {/* Opponent status - TOP LEFT */}
      <div className="absolute top-6 left-6 md:left-10">
        <StatusCard name={opponent.name} level={5} hpCurrent={19} hpMax={19} align="left" />
      </div>

      {/* Opponent sprite - TOP RIGHT */}
      <div className="absolute top-16 right-8 md:right-24">
        <img
          src={frontSprite(opponent.number)}
          alt={opponent.name}
          className="w-32 h-32 md:w-44 md:h-44 object-contain drop-shadow-lg"
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      {/* Player sprite - BOTTOM LEFT */}
      <div className="absolute bottom-10 left-8 md:left-24">
        <img
          src={backSprite(activePokemon.pokemon.pokeId)}
          alt={activePokemon.nickname || activePokemon.pokemon.name}
          className="w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-lg"
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      {/* Player status - BOTTOM RIGHT */}
      <div className="absolute bottom-8 right-6 md:right-10">
        <StatusCard
          name={activePokemon.nickname || activePokemon.pokemon.name}
          level={50}
          hpCurrent={100}
          hpMax={100}
          showHpNumbers
          align="right"
        />
      </div>
    </div>
  );
}
