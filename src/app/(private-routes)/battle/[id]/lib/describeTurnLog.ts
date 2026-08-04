import { IBattle, IBattleTurnLog, StatKey, StatusBlockedReason, StatusCondition, TurnLogEntry } from "@/types/IBattle";

// A maioria dos eventos carrega participantId no payload, mas eventos "de sistema" como
// battle-ended não têm ator — nesses casos actorParticipantId (setado pelo backend) também
// vem null, e o log é tratado como neutro na UI (não é "meu" nem "do adversário").
export function ownerParticipantId(log: IBattleTurnLog): string | null {
  if (log.actorParticipantId) return log.actorParticipantId;
  if ("participantId" in log.payload) return log.payload.participantId;
  return null;
}

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

export function describeTurnLog(entry: TurnLogEntry, battle: IBattle, currentUserId?: string): string {
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
