import { IBattle, IBattleParticipant, IBattlePokemon, StatKey, StatusCondition, TurnLogEntry } from "@/types/IBattle";
import { describeEntryLines, LogLine, namesFromBattle } from "./describeTurnLog";

/**
 * Playback do turno: o snapshot que chega depois de um turn-resolved já vem com o estado FINAL do
 * turno inteiro (HP, desmaio, status, troca do bot...). Pra que nada apareça antes da hora, a cena
 * não lê esse snapshot enquanto o turno toca — lê o snapshot de ANTES do turno (`base`) com os
 * efeitos das etapas já tocadas aplicados por cima. Tudo aqui é puro: só dados de entrada → saída.
 */

export type Side = "me" | "opponent";

/** Mudança de estado que uma etapa aplica na cena (no instante `revealAtMs` dela). */
export type StepEffect =
  | { type: "hp"; battlePokemonId: string; delta: number }
  | { type: "faint"; battlePokemonId: string }
  | { type: "status"; battlePokemonId: string; status: StatusCondition }
  | { type: "stat"; battlePokemonId: string; stat: StatKey; newStage: number }
  | { type: "switch"; participantId: string; battlePokemonId: string };

/** Animação transitória mostrada sobre o card de status de um lado. */
export type CardEffect =
  | { kind: "status"; status: StatusCondition; variant: "applied" | "cured" }
  | { kind: "stat"; stat: StatKey; stages: number }
  | { kind: "heal"; amount: number }
  | { kind: "float"; text: string; tone: "damage" | "miss" | "immune"; delayMs?: number };

export interface PlaybackStep {
  text: string;
  durationMs: number;
  // Quando (desde o início da etapa) os `effects` passam a valer — dá tempo do golpe "acertar"
  // antes da barra de HP começar a cair.
  revealAtMs: number;
  effects: StepEffect[];
  lungeSide?: Side;
  hitSide?: Side;
  // Atraso da reação do alvo, pra coincidir com o fim do avanço do atacante.
  hitDelayMs?: number;
  faintSide?: Side;
  cardEffect?: { side: Side; effect: CardEffect };
}

const TIMING = {
  action: { durationMs: 1500, revealAtMs: 650 },
  followUp: { durationMs: 1100, revealAtMs: 0 },
  faint: { durationMs: 1400, revealAtMs: 0 },
  selfDamage: { durationMs: 1400, revealAtMs: 450 },
  effect: { durationMs: 1300, revealAtMs: 250 },
  text: { durationMs: 1300, revealAtMs: 0 },
  battleEnded: { durationMs: 1800, revealAtMs: 0 },
};

function findPokemon(battle: IBattle, battlePokemonId: string): { participant: IBattleParticipant; pokemon: IBattlePokemon } | null {
  for (const participant of battle.participants) {
    const pokemon = participant.pokemons.find((p) => p.id === battlePokemonId);
    if (pokemon) return { participant, pokemon };
  }
  return null;
}

function updatePokemon(battle: IBattle, battlePokemonId: string, update: (p: IBattlePokemon) => IBattlePokemon): IBattle {
  return {
    ...battle,
    participants: battle.participants.map((participant) =>
      participant.pokemons.some((p) => p.id === battlePokemonId)
        ? { ...participant, pokemons: participant.pokemons.map((p) => (p.id === battlePokemonId ? update(p) : p)) }
        : participant,
    ),
  };
}

export function applyEffects(battle: IBattle, effects: StepEffect[]): IBattle {
  return effects.reduce<IBattle>((acc, effect) => {
    switch (effect.type) {
      case "hp":
        return updatePokemon(acc, effect.battlePokemonId, (p) => ({
          ...p,
          currentHp: Math.max(0, Math.min(p.maxHp, p.currentHp + effect.delta)),
        }));
      case "faint":
        return updatePokemon(acc, effect.battlePokemonId, (p) => ({ ...p, currentHp: 0, fainted: true }));
      case "status":
        return updatePokemon(acc, effect.battlePokemonId, (p) => ({ ...p, statusCondition: effect.status }));
      case "stat":
        return updatePokemon(acc, effect.battlePokemonId, (p) => ({
          ...p,
          statStages: { ...p.statStages, [effect.stat]: effect.newStage },
        }));
      case "switch": {
        const found = findPokemon(acc, effect.battlePokemonId);
        if (!found) return acc;
        return {
          ...acc,
          participants: acc.participants.map((participant) =>
            participant.id === effect.participantId ? { ...participant, activeSlot: found.pokemon.position } : participant,
          ),
        };
      }
    }
  }, battle);
}

function sideOfParticipant(participantId: string, myParticipantId: string | null): Side {
  return participantId === myParticipantId ? "me" : "opponent";
}

/** Texto do dano flutuante: % pro adversário (o HP dele não aparece em números), absoluto pro meu lado. */
function damageFloat(side: Side, damage: number, maxHp: number, delayMs = 0): CardEffect {
  const text = side === "me" ? `-${damage}` : `-${Math.max(1, Math.round((damage / maxHp) * 100))}%`;
  return { kind: "float", text, tone: "damage", delayMs };
}

function stepsForEntry(entry: TurnLogEntry, state: IBattle, myParticipantId: string | null): PlaybackStep[] {
  const lines = describeEntryLines(entry, namesFromBattle(state, myParticipantId, true));
  const lineOf = (role: LogLine["role"]) => lines.find((l) => l.role === role);
  const mainText = lines[0]?.text ?? "";
  const sideOfPokemon = (battlePokemonId: string): Side =>
    sideOfParticipant(findPokemon(state, battlePokemonId)?.participant.id ?? "", myParticipantId);

  // Linhas "de acompanhamento" (crítico, efetividade) viram etapas só de texto, na ordem narrada.
  const followUps = (roles: LogLine["role"][]): PlaybackStep[] =>
    lines.filter((l) => roles.includes(l.role)).map((l) => ({ text: l.text, ...TIMING.followUp, effects: [] }));

  const faintStep = (battlePokemonId: string): PlaybackStep[] => {
    const line = lineOf("faint");
    if (!line) return [];
    return [{ text: line.text, ...TIMING.faint, effects: [{ type: "faint", battlePokemonId }], faintSide: sideOfPokemon(battlePokemonId) }];
  };

  switch (entry.event) {
    case "move": {
      const attackerSide = sideOfParticipant(entry.participantId, myParticipantId);
      const targetSide = sideOfPokemon(entry.targetBattlePokemonId);
      const target = findPokemon(state, entry.targetBattlePokemonId)?.pokemon;

      if (entry.missed) {
        return [
          { text: mainText, ...TIMING.action, effects: [], lungeSide: attackerSide },
          {
            text: lineOf("miss")?.text ?? "",
            ...TIMING.followUp,
            effects: [],
            cardEffect: { side: targetSide, effect: { kind: "float", text: "Errou!", tone: "miss" } },
          },
        ];
      }

      const immune = lines.some((l) => l.role === "effectiveness" && entry.effectiveness === "no_effect");
      const dealsDamage = entry.damage > 0;
      const action: PlaybackStep = {
        text: mainText,
        ...TIMING.action,
        effects: dealsDamage ? [{ type: "hp", battlePokemonId: entry.targetBattlePokemonId, delta: -entry.damage }] : [],
        lungeSide: attackerSide,
        hitSide: dealsDamage ? targetSide : undefined,
        hitDelayMs: 350,
        // Número aparece junto com a reação do alvo, não no começo do avanço do atacante.
        cardEffect:
          dealsDamage && target ? { side: targetSide, effect: damageFloat(targetSide, entry.damage, target.maxHp, 350) } : undefined,
      };
      if (immune) {
        return [
          action,
          ...followUps(["effectiveness"]).map((step) => ({
            ...step,
            cardEffect: { side: targetSide, effect: { kind: "float", text: "Sem efeito", tone: "immune" } as CardEffect },
          })),
        ];
      }
      return [action, ...followUps(["critical", "effectiveness"]), ...(entry.targetFainted ? faintStep(entry.targetBattlePokemonId) : [])];
    }

    case "confusion-hit":
    case "status-tick":
    case "recoil": {
      const side = sideOfPokemon(entry.battlePokemonId);
      const pokemon = findPokemon(state, entry.battlePokemonId)?.pokemon;
      return [
        {
          text: mainText,
          ...TIMING.selfDamage,
          effects: [{ type: "hp", battlePokemonId: entry.battlePokemonId, delta: -entry.damage }],
          hitSide: side,
          hitDelayMs: 0,
          cardEffect: pokemon ? { side, effect: damageFloat(side, entry.damage, pokemon.maxHp) } : undefined,
        },
        ...(entry.targetFainted ? faintStep(entry.battlePokemonId) : []),
      ];
    }

    case "status-applied":
    case "status-cured": {
      const applied = entry.event === "status-applied";
      return [
        {
          text: mainText,
          ...TIMING.effect,
          effects: [{ type: "status", battlePokemonId: entry.battlePokemonId, status: applied ? entry.statusCondition : "NONE" }],
          cardEffect: {
            side: sideOfPokemon(entry.battlePokemonId),
            effect: { kind: "status", status: entry.statusCondition, variant: applied ? "applied" : "cured" },
          },
        },
      ];
    }

    case "stat-change":
      return [
        {
          text: mainText,
          ...TIMING.effect,
          effects: [{ type: "stat", battlePokemonId: entry.battlePokemonId, stat: entry.stat, newStage: entry.newStage }],
          cardEffect: { side: sideOfPokemon(entry.battlePokemonId), effect: { kind: "stat", stat: entry.stat, stages: entry.stages } },
        },
      ];

    case "heal":
      return [
        {
          text: mainText,
          ...TIMING.effect,
          effects: [{ type: "hp", battlePokemonId: entry.battlePokemonId, delta: entry.amount }],
          cardEffect: { side: sideOfPokemon(entry.battlePokemonId), effect: { kind: "heal", amount: entry.amount } },
        },
      ];

    case "switch":
      // A troca muda o Pokémon ativo já no começo da etapa — a remontagem do sprite toca a entrada.
      return [
        {
          text: mainText,
          ...TIMING.text,
          effects: [{ type: "switch", participantId: entry.participantId, battlePokemonId: entry.battlePokemonId }],
        },
      ];

    case "battle-ended":
      return [{ text: mainText, ...TIMING.battleEnded, effects: [] }];

    default:
      return lines.map((line) => ({ text: line.text, ...TIMING.text, effects: [] }));
  }
}

/**
 * Converte os eventos (na ordem do backend) em etapas de playback. Simula o estado evento a evento
 * a partir de `base`, então os nomes e o lado de cada Pokémon refletem quem estava em campo naquele
 * instante (ex.: "O oponente enviou X!" seguido de "X inimigo usou...").
 */
export function buildPlaybackSteps(base: IBattle, entries: TurnLogEntry[], myParticipantId: string | null): PlaybackStep[] {
  const steps: PlaybackStep[] = [];
  let state = base;
  for (const entry of entries) {
    const entrySteps = stepsForEntry(entry, state, myParticipantId);
    steps.push(...entrySteps);
    state = applyEffects(
      state,
      entrySteps.flatMap((s) => s.effects),
    );
  }
  return steps;
}

/** Estado que a cena deve mostrar com `cursor` etapas já concluídas (e a atual revelada ou não). */
export function displayedBattleAt(base: IBattle, steps: PlaybackStep[], cursor: number, currentRevealed: boolean): IBattle {
  const done = steps.slice(0, cursor).flatMap((s) => s.effects);
  const current = currentRevealed && steps[cursor] ? steps[cursor].effects : [];
  return applyEffects(base, [...done, ...current]);
}
