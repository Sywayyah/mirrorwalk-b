import { PlayerInstanceModel, PlayerModel, UnitGroupInstModel } from 'src/app/core/model/main.model';
import { SpellInstance } from 'src/app/core/model/spells';
import { NeutralCampStructure, StructureModel } from "src/app/core/model/structures.types";
import { EventModel } from '../state-old/events-service-base';
import { PopupModel } from './popup.types';

export enum BattleEvent {
  UI_Player_Clicks_Enemy_Group,
  UI_Player_Clicks_Ally_Group,
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

  OnGroupModifiersChagned,
  OnGroupSpellsChanged,

  Combat_Group_Attacked,
  Combat_Attack_Interaction,
  Combat_Unit_Speed_Changed,

  Round_Group_Spends_Turn,
  Round_Group_Turn_Ends,

  Round_Player_Turn_Starts,
  Round_Player_Continues_Attacking,

  Fight_Starts,
  Fight_Next_Round_Starts,
  Fight_Ends
}

export type BattleEventModel<T extends BattleEvent = BattleEvent> = EventModel<T>;

export interface UnitEvent<T extends BattleEvent> extends BattleEventModel<T> {
  unitGroup: UnitGroupInstModel;
}

/* Example for simplfied event types creation */
interface CommonEventProps {
  unitGroup: UnitGroupInstModel;
  player: PlayerInstanceModel;
  spell: SpellInstance;
  target: UnitGroupInstModel;
}

type BuildEventType<E extends BattleEvent, T extends keyof CommonEventProps> = BattleEventModel<E> & Pick<CommonEventProps, T>;

// type SpellEvent = BuildEventType<BattleEvent.Player_Targets_Spell, 'player' | 'spell' | 'target'>;

export interface PlayerTargetsSpell extends BattleEventModel<BattleEvent.Player_Targets_Spell> {
  player: PlayerInstanceModel;
  spell: SpellInstance;
  target: UnitGroupInstModel;
}

export interface PlayerCastsInstantSpell extends BattleEventModel<BattleEvent.Player_Casts_Instant_Spell> {
  player: PlayerInstanceModel;
  spell: SpellInstance;
}

export interface PlayerGainsLevel extends BattleEventModel<BattleEvent.Player_Gains_Level> { }

export interface StructSelected extends BattleEventModel<BattleEvent.Struct_Selected> {
  struct: StructureModel;
}

export interface DisplayRewardPopup extends BattleEventModel<BattleEvent.Display_Reward_Popup> {
  struct: NeutralCampStructure;
}

export interface StructCompleted extends BattleEventModel<BattleEvent.Struct_Completed> {
  struct: NeutralCampStructure;
}

export interface DisplayPopupEvent extends BattleEventModel<BattleEvent.Display_Popup> {
  popup: PopupModel;
}

export interface StructureFightConfirmed extends BattleEventModel<BattleEvent.Struct_Fight_Confirmed> {
  struct: NeutralCampStructure;
}

export interface UIPlayerClicksEnemyGroup extends BattleEventModel<BattleEvent.UI_Player_Clicks_Enemy_Group> {
  attackingPlayer: PlayerInstanceModel;
  attackingGroup: UnitGroupInstModel;
  attackedGroup: UnitGroupInstModel;
}

export enum HoverTypeEnum {
  EnemyCard,
  AllyCard,
  Unhover,
}

export interface UIPlayerHoversCard extends BattleEventModel<BattleEvent.UI_Player_Hovers_Group_Card> {
  // hovered: boolean;
  hoverType: HoverTypeEnum;
  currentCard?: UnitGroupInstModel;
  hoveredCard?: UnitGroupInstModel;
}

export interface GroupDamagedByGroupEvent extends BattleEventModel<BattleEvent.On_Group_Damaged_By_Group> {
  attackerGroup: UnitGroupInstModel;
  attackedGroup: UnitGroupInstModel;
  loss: number;
  damage: number;
}

export interface GroupTakesDamageEvent extends BattleEventModel<BattleEvent.On_Group_Takes_Damage> {
  group: UnitGroupInstModel;
  registerLoss: boolean;
  unitLoss: number;
}

export interface OnGroupCounterAttacked extends BattleEventModel<BattleEvent.On_Group_Counter_Attacked> {
  attackerGroup: UnitGroupInstModel;
  attackedGroup: UnitGroupInstModel;
  loss: number;
  damage: number;
}

export interface GroupDiesEvent extends BattleEventModel<BattleEvent.On_Group_Dies> {
  target: UnitGroupInstModel;
  targetPlayer: PlayerModel;
  loss: number;
}

export interface RoundEndsEvent extends BattleEventModel<BattleEvent.Fight_Ends> {
  win: boolean;
  struct: StructureModel;
}

export interface RoundNextGroupTurnEvent extends BattleEventModel<BattleEvent.Fight_Next_Round_Starts> {
  round: number;
}


export type RountPlayerContinuesAttacking = BattleEventModel<BattleEvent.Round_Player_Continues_Attacking>;

export interface RoundGroupTurnEnds extends BattleEventModel<BattleEvent.Round_Group_Turn_Ends> {
  playerEndsTurn: PlayerModel;
}

export interface RoundGroupSpendsTurn extends BattleEventModel<BattleEvent.Round_Group_Spends_Turn> {
  groupPlayer: PlayerModel;
  group: UnitGroupInstModel;
  groupStillAlive: boolean;
  groupHasMoreTurns: boolean;
}

export interface RoundPlayerTurnStarts extends BattleEventModel<BattleEvent.Round_Player_Turn_Starts> {
  currentPlayer: PlayerModel;
  previousPlayer: PlayerModel;
}

export interface CombatGroupAttacked extends BattleEventModel<BattleEvent.Combat_Group_Attacked> {
  attackerGroup: UnitGroupInstModel;
  attackedGroup: UnitGroupInstModel;
}

export enum CombatInteractionEnum {
  GroupAttacks = 'attacks',
  GroupCounterattacks = 'counterattacks',
  AttackInteractionCompleted = 'completed',
}

export interface CombatInteractionState extends BattleEventModel<BattleEvent.Combat_Attack_Interaction> {
  attackingGroup: UnitGroupInstModel;
  attackedGroup: UnitGroupInstModel;
  action: CombatInteractionEnum;
}

export interface SpeedEvent extends BattleEventModel<BattleEvent.Combat_Unit_Speed_Changed> {
}


export type FightStartsEvent = BattleEventModel<BattleEvent.Fight_Starts>;
export type OnGroupModsChanged = UnitEvent<BattleEvent.OnGroupModifiersChagned>;
export type OnGroupSpellsChanged = BuildEventType<BattleEvent.OnGroupSpellsChanged, 'unitGroup'>;

export interface EventByEnumMapping extends Record<BattleEvent, BattleEventModel> {
  [BattleEvent.Struct_Selected]: StructSelected;
  [BattleEvent.Struct_Completed]: StructCompleted;
  [BattleEvent.Display_Reward_Popup]: DisplayRewardPopup;
  [BattleEvent.Struct_Fight_Confirmed]: StructureFightConfirmed;
  [BattleEvent.Display_Popup]: DisplayPopupEvent;

  [BattleEvent.Player_Gains_Level]: PlayerGainsLevel;
  [BattleEvent.Player_Targets_Spell]: PlayerTargetsSpell;
  [BattleEvent.Player_Casts_Instant_Spell]: PlayerCastsInstantSpell;

  [BattleEvent.UI_Player_Clicks_Enemy_Group]: UIPlayerClicksEnemyGroup;
  [BattleEvent.UI_Player_Clicks_Ally_Group]: UnitEvent<BattleEvent.UI_Player_Clicks_Ally_Group>;
  [BattleEvent.UI_Player_Hovers_Group_Card]: UIPlayerHoversCard;

  [BattleEvent.Combat_Group_Attacked]: CombatGroupAttacked;
  [BattleEvent.Combat_Attack_Interaction]: CombatInteractionState;
  [BattleEvent.Combat_Unit_Speed_Changed]: SpeedEvent;

  [BattleEvent.OnGroupModifiersChagned]: OnGroupModsChanged;
  [BattleEvent.OnGroupSpellsChanged]: OnGroupSpellsChanged;

  [BattleEvent.On_Group_Damaged_By_Group]: GroupDamagedByGroupEvent;
  [BattleEvent.On_Group_Takes_Damage]: GroupTakesDamageEvent;
  [BattleEvent.On_Group_Counter_Attacked]: OnGroupCounterAttacked;
  [BattleEvent.On_Group_Dies]: GroupDiesEvent;

  [BattleEvent.Round_Group_Spends_Turn]: RoundGroupSpendsTurn;
  [BattleEvent.Round_Group_Turn_Ends]: RoundGroupTurnEnds;

  [BattleEvent.Round_Player_Turn_Starts]: RoundPlayerTurnStarts;
  [BattleEvent.Round_Player_Continues_Attacking]: RountPlayerContinuesAttacking;

  [BattleEvent.Fight_Starts]: FightStartsEvent;
  [BattleEvent.Fight_Next_Round_Starts]: RoundNextGroupTurnEvent;
  [BattleEvent.Fight_Ends]: RoundEndsEvent;
}

export type BattleEvents = EventByEnumMapping[keyof EventByEnumMapping];
