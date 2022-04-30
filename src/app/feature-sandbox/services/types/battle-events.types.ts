import { PlayerModel, UnitGroupModel } from 'src/app/core/model/main.model';


export enum BattleEventTypeEnum {
  UI_Player_Clicks_Enemy_Group,
  UI_Player_Hovers_Group_Card,

  On_Group_Damaged,
  /* todo: this event can be merged with On_Group_Damaged, introducing field isCounterattack */
  On_Group_Counter_Attacked,
  On_Group_Dies,

  Combat_Group_Attacked,
  Combat_Attack_Interaction,

  Round_Group_Spends_Turn,
  Round_Group_Turn_Ends,

  Round_Player_Turn_Starts,
  Round_Player_Continues_Attacking,

  Fight_Starts,
  Fight_Next_Round_Starts,
  Fight_Ends
}

export interface BattleEventModel<T extends BattleEventTypeEnum = BattleEventTypeEnum> {
  type: T;
}

export interface UIPlayerClicksEnemyGroup extends BattleEventModel<BattleEventTypeEnum.UI_Player_Clicks_Enemy_Group> {
  attackingPlayer: PlayerModel;
  attackingGroup: UnitGroupModel;
  attackedGroup: UnitGroupModel;
}

export enum HoverTypeEnum {
  EnemyCard,
  Unhover,
}

export interface UIPlayerHoversCard extends BattleEventModel<BattleEventTypeEnum.UI_Player_Hovers_Group_Card> {
  // hovered: boolean;
  hoverType: HoverTypeEnum;
  currentCard?: UnitGroupModel;
  hoveredCard?: UnitGroupModel;
}

export interface GroupDamagedEvent extends BattleEventModel<BattleEventTypeEnum.On_Group_Damaged> {
  attackerGroup: UnitGroupModel;
  attackedGroup: UnitGroupModel;
  loss: number;
  damage: number;
}

export interface OnGroupCounterAttacked extends BattleEventModel<BattleEventTypeEnum.On_Group_Counter_Attacked> {
  attackerGroup: UnitGroupModel;
  attackedGroup: UnitGroupModel;
  loss: number;
  damage: number;
}

export interface GroupDiesEvent extends BattleEventModel<BattleEventTypeEnum.On_Group_Dies> {
  target: UnitGroupModel;
  targetPlayer: PlayerModel;
  loss: number;
}

export interface RoundEndsEvent extends BattleEventModel<BattleEventTypeEnum.Fight_Ends> {
  win: boolean;
}

export interface RoundNextGroupTurnEvent extends BattleEventModel<BattleEventTypeEnum.Fight_Next_Round_Starts> {
  round: number;
}


export type RountPlayerContinuesAttacking = BattleEventModel<BattleEventTypeEnum.Round_Player_Continues_Attacking>;

export interface RoundGroupTurnEnds extends BattleEventModel<BattleEventTypeEnum.Round_Group_Turn_Ends> {
  playerEndsTurn: PlayerModel;
}

export interface RoundGroupSpendsTurn extends BattleEventModel<BattleEventTypeEnum.Round_Group_Spends_Turn> {
  groupPlayer: PlayerModel;
  group: UnitGroupModel;
  groupStillAlive: boolean;
  groupHasMoreTurns: boolean;
}

export interface RoundPlayerTurnStarts extends BattleEventModel<BattleEventTypeEnum.Round_Player_Turn_Starts> {
  currentPlayer: PlayerModel;
  previousPlayer: PlayerModel;
}

export interface CombatGroupAttacked extends BattleEventModel<BattleEventTypeEnum.Combat_Group_Attacked> {
  attackerGroup: UnitGroupModel;
  attackedGroup: UnitGroupModel;
}

export enum CombatInteractionEnum {
  GroupAttacks = 'attacks',
  GroupCounterattacks = 'counterattacks',
  AttackInteractionCompleted = 'completed',
}

export interface CombatInteractionState extends BattleEventModel<BattleEventTypeEnum.Combat_Attack_Interaction> {
  attackingGroup: UnitGroupModel;
  attackedGroup: UnitGroupModel;
  action: CombatInteractionEnum;
}

export type FightStartsEvent = BattleEventModel<BattleEventTypeEnum.Fight_Starts>;

export interface EventByEnumMapping {
  [BattleEventTypeEnum.UI_Player_Clicks_Enemy_Group]: UIPlayerClicksEnemyGroup;
  [BattleEventTypeEnum.UI_Player_Hovers_Group_Card]: UIPlayerHoversCard;

  [BattleEventTypeEnum.Combat_Group_Attacked]: CombatGroupAttacked;
  [BattleEventTypeEnum.Combat_Attack_Interaction]: CombatInteractionState;

  [BattleEventTypeEnum.On_Group_Damaged]: GroupDamagedEvent;
  [BattleEventTypeEnum.On_Group_Counter_Attacked]: OnGroupCounterAttacked;
  [BattleEventTypeEnum.On_Group_Dies]: GroupDiesEvent;

  [BattleEventTypeEnum.Round_Group_Spends_Turn]: RoundGroupSpendsTurn;
  [BattleEventTypeEnum.Round_Group_Turn_Ends]: RoundGroupTurnEnds;

  [BattleEventTypeEnum.Round_Player_Turn_Starts]: RoundPlayerTurnStarts;
  [BattleEventTypeEnum.Round_Player_Continues_Attacking]: RountPlayerContinuesAttacking;

  [BattleEventTypeEnum.Fight_Starts]: FightStartsEvent;
  [BattleEventTypeEnum.Fight_Next_Round_Starts]: RoundNextGroupTurnEvent;
  [BattleEventTypeEnum.Fight_Ends]: RoundEndsEvent;
}

export type BattleEvents = EventByEnumMapping[keyof EventByEnumMapping];
