import { PlayerModel, StructureModel, UnitGroupInstModel } from "src/app/core/model";
import { props } from "../common";

export enum CombatInteractionEnum {
  GroupAttacks = 'attacks',
  GroupCounterattacks = 'counterattacks',
  AttackInteractionCompleted = 'completed',
}

export type GroupTakesDamageEvent = {
  group: UnitGroupInstModel;
  registerLoss: boolean;
  unitLoss: number;
};

export type GroupDiesEvent = props<'target' | 'loss' | 'targetPlayer'>;

export type GroupDamagedByGroupEvent = props<'attackingGroup' | 'attackedGroup' | 'loss' | 'damage'>;

export type RoundGroupSpendsTurnEvent = {
  groupStillAlive: boolean;
  group: UnitGroupInstModel;
  groupHasMoreTurns: boolean;
  groupPlayer: PlayerModel;
};

export type PlayerTurnStartEvent = {
  currentPlayer: PlayerModel;
  previousPlayer: PlayerModel;
};

export type GroupAttackedEvent = props<'attackedGroup' | 'attackingGroup'>;

export type CombatInteractionStateEvent = props<'attackingGroup' | 'attackedGroup' | 'action'>;

export type PlayerTargetsSpellEvent = props<'player' | 'spell' | 'target'>;

export type PlayerTargetsInstantSpellEvent = props<'player' | 'spell'>;

export type UnitHealedEvent = props<'target'> & { healedUnitsCount: number };

export type NextRoundStarts = { round: number };

export type FightEndsEvent = {
  win: boolean;
  struct: StructureModel;
};
