import { IPokeMove } from "./IPokeMove";

export type BattleStatus = "WAITING_OPPONENT" | "SELECTING_LEAD" | "IN_PROGRESS" | "FINISHED";
export type BattleTurnState = "WAITING_ACTION" | "ACTION_SUBMITTED" | "WAITING_FORCED_SWITCH";
export type BattleActionType = "MOVE" | "SWITCH" | "ITEM" | "FORFEIT";
export type BattleEffectiveness = "no_effect" | "not_very_effective" | "effective" | "super_effective";
export type TeamName = "teamAlpha" | "teamBeta" | "teamGamma";
export type StatusCondition = "NONE" | "PARALYZED" | "POISONED" | "BURNED" | "ASLEEP" | "FROZEN" | "CONFUSED";

export interface IBattlePokemonMove {
  id: string;
  battlePokemonId: string;
  moveId: string;
  maxPp: number;
  currentPp: number;
  move: IPokeMove;
}

export interface IBattlePokemonSpecies {
  pokeId: number;
  name: string;
  img1: string;
  types: string;
}

export interface IBattlePokemon {
  id: string;
  battleParticipantId: string;
  myPokemonId: string;
  position: number;
  maxHp: number;
  currentHp: number;
  atk: number;
  def: number;
  spAtk: number;
  spDef: number;
  speed: number;
  statStages: Record<string, number>;
  statusCondition: StatusCondition;
  statusCounter: number;
  fainted: boolean;
  moves: IBattlePokemonMove[];
  myPokemon: {
    id: string;
    nickname: string | null;
    pokemon: IBattlePokemonSpecies;
  };
}

export interface IBattleParticipant {
  id: string;
  battleId: string;
  userId: string;
  teamName: TeamName;
  activeSlot: number;
  turnState: BattleTurnState;
  // Assumindo { type } por enquanto — confirmar shape exato com o backend (não documentado).
  pendingAction: { type: BattleActionType } | null;
  forfeited: boolean;
  pokemons: IBattlePokemon[];
}

// Confirmado 1:1 com battle-engine.service.ts (TurnLogEntry) no backend.
export type TurnLogEntry =
  | { event: "switch"; participantId: string; battlePokemonId: string }
  | { event: "forfeit"; participantId: string }
  | { event: "move-failed"; participantId: string; moveId: string; reason: "no-pp" | "invalid-target" }
  | {
      event: "move";
      participantId: string;
      moveId: string;
      targetParticipantId: string;
      targetBattlePokemonId: string;
      missed: boolean;
      damage: number;
      effectiveness: BattleEffectiveness;
      critical: boolean;
      targetFainted: boolean;
    }
  | { event: "battle-ended"; winnerParticipantId: string | null; reason: "faint" | "forfeit" };

export interface IBattleTurnLog {
  id: string;
  battleId: string;
  turnNumber: number;
  actorParticipantId: string | null;
  actionType: BattleActionType;
  payload: TurnLogEntry;
  createdAt: string;
}

export interface IBattle {
  id: string;
  status: BattleStatus;
  playerAId: string;
  playerBId: string | null;
  turnNumber: number;
  winnerId: string | null;
  createdAt: string;
  updatedAt: string;
  participants: IBattleParticipant[];
  turnLogs: IBattleTurnLog[];
}

// battle-updated tem formato variado dependendo do que disparou o evento — tratar como união.
export type BattleUpdatedEvent =
  | { participantId: string; activeSlot: number }
  | { participantId: string; ready: true }
  | { status: BattleStatus; turnNumber: number }
  | { userId: string; forcedSwitchResolved: true };

export interface OpponentActionSubmittedEvent {
  userId: string;
}

export interface TurnResolvedEvent {
  turnNumber: number;
  log: TurnLogEntry[];
  forcedSwitchParticipantIds: string[];
}

export interface ForcedSwitchRequiredEvent {
  participantId: string;
}

export interface BattleEndedEvent {
  winnerId: string | null;
  reason: "faint";
}

export interface SubmitActionPayload {
  type: BattleActionType;
  moveId?: string;
  targetPokemonId?: string;
  itemId?: string;
}
