import { PlayerInstanceModel, PlayerModel, UnitGroupInstModel } from 'src/app/core/model/main.model';
import { SpellInstance } from 'src/app/core/model/spells';
import { NeutralCampStructure, StructureModel } from "src/app/core/model/structures.types";
import { PopupModel } from './popup.types';


export enum BattleEventTypeEnum {
  UI_Player_Clicks_Enemy_Group,
  UI_Player_Hovers_Group_Card,

  /* todo: it can be considered to split away these events */
  Struct_Selected,
  Struct_Completed,
  Struct_Fight_Confirmed,

  Player_Gains_Level,
  Player_Targets_Spell,
  Player_Casts_Instant_Spell,

  Display_Reward_Popup,
  Display_Popup,

  On_Group_Damaged_By_Group,
  On_Group_Takes_Damage,
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

export interface PlayerTargetsSpell extends BattleEventModel<BattleEventTypeEnum.Player_Targets_Spell> {
  player: PlayerInstanceModel;
  spell: SpellInstance;
  target: UnitGroupInstModel;
}

export interface PlayerCastsInstantSpell extends BattleEventModel<BattleEventTypeEnum.Player_Casts_Instant_Spell> {
  player: PlayerInstanceModel;
  spell: SpellInstance;
}

export interface PlayerGainsLevel extends BattleEventModel<BattleEventTypeEnum.Player_Gains_Level> {}

export interface StructSelected extends BattleEventModel<BattleEventTypeEnum.Struct_Selected> {
  struct: StructureModel;
}

export interface DisplayRewardPopup extends BattleEventModel<BattleEventTypeEnum.Display_Reward_Popup> {
  struct: NeutralCampStructure;
}

export interface StructCompleted extends BattleEventModel<BattleEventTypeEnum.Struct_Completed> {
  struct: NeutralCampStructure;
}

export interface DisplayPopupEvent extends BattleEventModel<BattleEventTypeEnum.Display_Popup> {
  popup: PopupModel;
}

export interface StructureFightConfirmed extends BattleEventModel<BattleEventTypeEnum.Struct_Fight_Confirmed> {
  struct: NeutralCampStructure;
}

export interface UIPlayerClicksEnemyGroup extends BattleEventModel<BattleEventTypeEnum.UI_Player_Clicks_Enemy_Group> {
  attackingPlayer: PlayerInstanceModel;
  attackingGroup: UnitGroupInstModel;
  attackedGroup: UnitGroupInstModel;
}

export enum HoverTypeEnum {
  EnemyCard,
  Unhover,
}

export interface UIPlayerHoversCard extends BattleEventModel<BattleEventTypeEnum.UI_Player_Hovers_Group_Card> {
  // hovered: boolean;
  hoverType: HoverTypeEnum;
  currentCard?: UnitGroupInstModel;
  hoveredCard?: UnitGroupInstModel;
}

export interface GroupDamagedByGroupEvent extends BattleEventModel<BattleEventTypeEnum.On_Group_Damaged_By_Group> {
  attackerGroup: UnitGroupInstModel;
  attackedGroup: UnitGroupInstModel;
  loss: number;
  damage: number;
}

export interface GroupTakesDamageEvent extends BattleEventModel<BattleEventTypeEnum.On_Group_Takes_Damage> {
  group: UnitGroupInstModel;
  registerLoss: boolean;
  unitLoss: number;
}

export interface OnGroupCounterAttacked extends BattleEventModel<BattleEventTypeEnum.On_Group_Counter_Attacked> {
  attackerGroup: UnitGroupInstModel;
  attackedGroup: UnitGroupInstModel;
  loss: number;
  damage: number;
}

export interface GroupDiesEvent extends BattleEventModel<BattleEventTypeEnum.On_Group_Dies> {
  target: UnitGroupInstModel;
  targetPlayer: PlayerModel;
  loss: number;
}

export interface RoundEndsEvent extends BattleEventModel<BattleEventTypeEnum.Fight_Ends> {
  win: boolean;
  struct: StructureModel;
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
  group: UnitGroupInstModel;
  groupStillAlive: boolean;
  groupHasMoreTurns: boolean;
}

export interface RoundPlayerTurnStarts extends BattleEventModel<BattleEventTypeEnum.Round_Player_Turn_Starts> {
  currentPlayer: PlayerModel;
  previousPlayer: PlayerModel;
}

export interface CombatGroupAttacked extends BattleEventModel<BattleEventTypeEnum.Combat_Group_Attacked> {
  attackerGroup: UnitGroupInstModel;
  attackedGroup: UnitGroupInstModel;
}

export enum CombatInteractionEnum {
  GroupAttacks = 'attacks',
  GroupCounterattacks = 'counterattacks',
  AttackInteractionCompleted = 'completed',
}

export interface CombatInteractionState extends BattleEventModel<BattleEventTypeEnum.Combat_Attack_Interaction> {
  attackingGroup: UnitGroupInstModel;
  attackedGroup: UnitGroupInstModel;
  action: CombatInteractionEnum;
}

export type FightStartsEvent = BattleEventModel<BattleEventTypeEnum.Fight_Starts>;

export interface EventByEnumMapping {
  [BattleEventTypeEnum.Struct_Selected]: StructSelected;
  [BattleEventTypeEnum.Struct_Completed]: StructCompleted;
  [BattleEventTypeEnum.Display_Reward_Popup]: DisplayRewardPopup;
  [BattleEventTypeEnum.Struct_Fight_Confirmed]: StructureFightConfirmed;
  [BattleEventTypeEnum.Display_Popup]: DisplayPopupEvent;
  
  [BattleEventTypeEnum.Player_Gains_Level]: PlayerGainsLevel;
  [BattleEventTypeEnum.Player_Targets_Spell]: PlayerTargetsSpell;
  [BattleEventTypeEnum.Player_Casts_Instant_Spell]: PlayerCastsInstantSpell;

  [BattleEventTypeEnum.UI_Player_Clicks_Enemy_Group]: UIPlayerClicksEnemyGroup;
  [BattleEventTypeEnum.UI_Player_Hovers_Group_Card]: UIPlayerHoversCard;

  [BattleEventTypeEnum.Combat_Group_Attacked]: CombatGroupAttacked;
  [BattleEventTypeEnum.Combat_Attack_Interaction]: CombatInteractionState;

  [BattleEventTypeEnum.On_Group_Damaged_By_Group]: GroupDamagedByGroupEvent;
  [BattleEventTypeEnum.On_Group_Takes_Damage]: GroupTakesDamageEvent;
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
