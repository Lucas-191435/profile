import { IBattle, IBattleTurnLog, StatKey, StatusBlockedReason, StatusCondition, TurnLogEntry } from "@/types/IBattle";

// A maioria dos eventos carrega participantId no payload, mas eventos "de sistema" como
// battle-ended não têm ator — nesses casos actorParticipantId (setado pelo backend) também
// vem null, e o log é tratado como neutro na UI (não é "meu" nem "do adversário").
export function ownerParticipantId(log: IBattleTurnLog): string | null {
  if (log.actorParticipantId) return log.actorParticipantId;
  if ("participantId" in log.payload) return log.payload.participantId;
  return null;
}

/**
 * Como resolver nomes ao narrar um evento. O diálogo da batalha usa o estado exibido no instante
 * do evento (sabe exatamente quem estava em campo); o histórico lateral só tem o snapshot atual e
 * usa uma heurística (ver namesFromBattle).
 */
export interface LogNameResolver {
  isMine: (participantId: string) => boolean;
  ownerOf: (battlePokemonId: string) => string | null;
  pokemonName: (battlePokemonId: string) => string;
  // Pokémon que estava em campo pelo participante quando o evento aconteceu.
  activePokemonId: (participantId: string, moveId?: string) => string | null;
  moveName: (moveId: string) => string;
  moveDamageClass: (moveId: string) => string | null;
}

/**
 * Papel de cada frase dentro do evento — a playback usa isso pra saber em qual frase tocar cada
 * animação (ex.: o desmaio só cai na frase "X desmaiou!", não na "usou golpe").
 */
export type LogLineRole = "action" | "miss" | "critical" | "effectiveness" | "faint" | "main";

export interface LogLine {
  role: LogLineRole;
  text: string;
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

function statusText(table: Record<Exclude<StatusCondition, "NONE">, string>, status: StatusCondition): string {
  return status === "NONE" ? "" : table[status];
}

/** Nome do Pokémon como aparece na narração: o do adversário leva "inimigo", como nos jogos. */
function pokemonLabel(names: LogNameResolver, battlePokemonId: string): string {
  const owner = names.ownerOf(battlePokemonId);
  const name = names.pokemonName(battlePokemonId);
  return owner && !names.isMine(owner) ? `${name} inimigo` : name;
}

function actorLabel(names: LogNameResolver, participantId: string, moveId?: string): string {
  const pokemonId = names.activePokemonId(participantId, moveId);
  if (pokemonId) return pokemonLabel(names, pokemonId);
  return names.isMine(participantId) ? "Seu Pokémon" : "O Pokémon inimigo";
}

function isStatusMove(entry: Extract<TurnLogEntry, { event: "move" }>, names: LogNameResolver): boolean {
  return (entry.damageClass ?? names.moveDamageClass(entry.moveId)) === "status";
}

/** Narra um evento do log como uma ou mais frases, na ordem em que aparecem no diálogo. */
export function describeEntryLines(entry: TurnLogEntry, names: LogNameResolver): LogLine[] {
  switch (entry.event) {
    case "switch":
      return [
        {
          role: "main",
          text: names.isMine(entry.participantId)
            ? `Vai, ${names.pokemonName(entry.battlePokemonId)}!`
            : `O oponente enviou ${names.pokemonName(entry.battlePokemonId)}!`,
        },
      ];
    case "forfeit":
      return [
        { role: "main", text: names.isMine(entry.participantId) ? "Você desistiu da batalha!" : "O oponente desistiu da batalha!" },
      ];
    case "move-failed":
      return [
        {
          role: "main",
          text:
            entry.reason === "no-pp"
              ? `${actorLabel(names, entry.participantId, entry.moveId)} tentou usar ${names.moveName(entry.moveId)}, mas não tinha PP!`
              : `${actorLabel(names, entry.participantId, entry.moveId)} tentou atacar, mas falhou!`,
        },
      ];
    case "move": {
      const lines: LogLine[] = [
        { role: "action", text: `${actorLabel(names, entry.participantId, entry.moveId)} usou ${names.moveName(entry.moveId)}!` },
      ];
      if (entry.missed) {
        lines.push({ role: "miss", text: "Mas errou!" });
        return lines;
      }
      // Golpe de status não causa dano — efetividade e crítico não fazem sentido na narração.
      if (!isStatusMove(entry, names)) {
        const target = pokemonLabel(names, entry.targetBattlePokemonId);
        if (entry.effectiveness === "no_effect") {
          lines.push({ role: "effectiveness", text: `Não afetou ${target}...` });
          return lines;
        }
        if (entry.critical) lines.push({ role: "critical", text: "Acerto crítico!" });
        if (entry.effectiveness === "super_effective") lines.push({ role: "effectiveness", text: "Foi super efetivo!" });
        if (entry.effectiveness === "not_very_effective") lines.push({ role: "effectiveness", text: "Não foi muito efetivo..." });
      }
      if (entry.targetFainted) lines.push({ role: "faint", text: `${pokemonLabel(names, entry.targetBattlePokemonId)} desmaiou!` });
      return lines;
    }
    case "status-applied":
      return [{ role: "main", text: `${pokemonLabel(names, entry.battlePokemonId)} ${statusText(STATUS_APPLIED_TEXT, entry.statusCondition)}!` }];
    case "status-blocked":
      return [{ role: "main", text: `${pokemonLabel(names, entry.battlePokemonId)} ${STATUS_BLOCKED_TEXT[entry.reason]}!` }];
    case "confusion-hit":
    case "status-tick":
    case "recoil": {
      const pokeName = pokemonLabel(names, entry.battlePokemonId);
      const text =
        entry.event === "confusion-hit"
          ? `${pokeName} se feriu na confusão!`
          : entry.event === "recoil"
          ? `${pokeName} sofreu dano de recuo!`
          : `${pokeName} ${statusText(STATUS_TICK_TEXT, entry.statusCondition)}!`;
      const lines: LogLine[] = [{ role: "main", text }];
      if (entry.targetFainted) lines.push({ role: "faint", text: `${pokeName} desmaiou!` });
      return lines;
    }
    case "status-cured":
      return [{ role: "main", text: `${pokemonLabel(names, entry.battlePokemonId)} ${statusText(STATUS_CURED_TEXT, entry.statusCondition)}!` }];
    case "stat-change": {
      const dir = entry.stages > 0 ? "aumentou" : "diminuiu";
      const intensity = Math.abs(entry.stages) >= 2 ? " bastante" : "";
      return [{ role: "main", text: `${STAT_LABELS[entry.stat]} de ${pokemonLabel(names, entry.battlePokemonId)} ${dir}${intensity}!` }];
    }
    case "heal":
      return [{ role: "main", text: `${pokemonLabel(names, entry.battlePokemonId)} recuperou HP!` }];
    case "battle-ended": {
      const text =
        entry.winnerParticipantId === null
          ? "A batalha terminou empatada!"
          : names.isMine(entry.winnerParticipantId)
          ? "Você venceu a batalha!"
          : "Você perdeu a batalha...";
      return [{ role: "main", text }];
    }
  }
}

/**
 * Resolver a partir de um snapshot. `exactActive` = o snapshot reflete o instante do evento (usado
 * pela playback); sem isso, o Pokémon que agiu é deduzido de quem conhece o golpe, já que o log do
 * move não diz qual Pokémon atacou e o `activeSlot` atual pode já ser outro.
 */
export function namesFromBattle(battle: IBattle, myParticipantId: string | null, exactActive = false): LogNameResolver {
  const findPokemon = (battlePokemonId: string) => {
    for (const participant of battle.participants) {
      const pokemon = participant.pokemons.find((p) => p.id === battlePokemonId);
      if (pokemon) return { participant, pokemon };
    }
    return null;
  };
  const findMove = (moveId: string) => {
    for (const participant of battle.participants) {
      for (const pokemon of participant.pokemons) {
        const move = pokemon.moves.find((m) => m.moveId === moveId);
        if (move) return move.move;
      }
    }
    return null;
  };

  return {
    isMine: (participantId) => participantId === myParticipantId,
    ownerOf: (battlePokemonId) => findPokemon(battlePokemonId)?.participant.id ?? null,
    pokemonName: (battlePokemonId) => {
      const pokemon = findPokemon(battlePokemonId)?.pokemon;
      return pokemon ? pokemon.myPokemon.nickname || pokemon.myPokemon.pokemon.name : "Pokémon";
    },
    activePokemonId: (participantId, moveId) => {
      const participant = battle.participants.find((p) => p.id === participantId);
      if (!participant) return null;
      const active = participant.pokemons.find((p) => p.position === participant.activeSlot) ?? null;
      if (exactActive || !moveId) return active?.id ?? null;
      const knowers = participant.pokemons.filter((p) => p.moves.some((m) => m.moveId === moveId));
      if (knowers.length === 1) return knowers[0].id;
      if (active && knowers.includes(active)) return active.id;
      return null;
    },
    moveName: (moveId) => findMove(moveId)?.name ?? "um golpe",
    moveDamageClass: (moveId) => findMove(moveId)?.damage_class ?? null,
  };
}

/** Texto corrido de um evento — usado pelo histórico lateral. */
export function describeTurnLog(entry: TurnLogEntry, names: LogNameResolver): string {
  return describeEntryLines(entry, names)
    .map((line) => line.text)
    .join(" ");
}
