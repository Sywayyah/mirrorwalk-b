import { UnitGroupInstModel, PlayerInstanceModel, PlayerModel } from "src/app/core/model/main.model";
import { SpellInstance } from "src/app/core/model/spells";
import { StructureModel } from "src/app/core/model/structures.types";

export enum CombatInteractionEnum {
  GroupAttacks = 'attacks',
  GroupCounterattacks = 'counterattacks',
  AttackInteractionCompleted = 'completed',
}

export interface CommonEventProps {
  unitGroup: UnitGroupInstModel;
  player: PlayerInstanceModel;
  targetPlayer: PlayerModel;
  spell: SpellInstance;
  target: UnitGroupInstModel;

  attackingPlayer: PlayerInstanceModel;
  attackedPlayer: PlayerInstanceModel;

  attackingGroup: UnitGroupInstModel;
  attackedGroup: UnitGroupInstModel;

  action: CombatInteractionEnum;

  loss: number;
  damage: number;
}

export type props<K extends keyof CommonEventProps> = Pick<CommonEventProps, K>;

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

export type NextRoundStarts = { round: number };

export type FightEndsEvent = {
  win: boolean;
  struct: StructureModel;
};
