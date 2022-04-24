import { PlayerModel, UnitGroupModel } from 'src/app/core/model/main.model';


export enum BattleEventTypeEnum {
  On_Group_Damaged,
  On_Group_Dies,

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



export interface GroupDamagedEvent extends BattleEventModel<BattleEventTypeEnum.On_Group_Damaged> {
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
  groupHasMoreTurns: boolean;
}

export interface RoundPlayerTurnStarts extends BattleEventModel<BattleEventTypeEnum.Round_Player_Turn_Starts> {
  currentPlayer: PlayerModel;
  previousPlayer: PlayerModel;
}

export type FightStartsEvent = BattleEventModel<BattleEventTypeEnum.Fight_Starts>;

export interface EventByEnumMapping {
  [BattleEventTypeEnum.On_Group_Damaged]: GroupDamagedEvent;
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
