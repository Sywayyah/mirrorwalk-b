import { Player } from 'src/app/core/players';
import { StructureModel } from 'src/app/core/structures';
import { UnitBaseType, UnitGroup } from 'src/app/core/unit-types';
import { props } from '../common';

export enum CombatInteractionEnum {
  GroupAttacks = 'attacks',
  GroupCounterattacks = 'counterattacks',
  AttackInteractionCompleted = 'completed',
}

export type GroupTakesDamageEvent = {
  group: UnitGroup;
  registerLoss: boolean;
  unitLoss: number;
};

export type GroupDiesEvent = props<'target' | 'loss' | 'targetPlayer'>;

export type GroupDamagedByGroupEvent = props<'attackingGroup' | 'attackedGroup' | 'loss' | 'damage'> & { attackersCount: number, attackedCount: number };

export type RoundGroupSpendsTurnEvent = {
  groupStillAlive: boolean;
  group: UnitGroup;
  groupHasMoreTurns: boolean;
  groupPlayer: Player;
};

export type PlayerTurnStartEvent = {
  currentPlayer: Player;
  previousPlayer: Player;
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

export type UnitSummonedEvent = {
  // ownerPlayer: PlayerInstanceModel;
  unitGroup: UnitGroup;
  // unitNumber: number;
};
