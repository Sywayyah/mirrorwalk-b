import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
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
  Fight_Ends,
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
};
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

/*
  todo: I have a feeling that I want to have such events system.
    because I might want to be able to listen different events 
    across the game. And maybe I want other systems to kind of
    depend on it;

    I'm not sure what kind of approach I'd like to use, for now
    I have one stream for all sorts of events;

  Also an idea is to listenUntil some other event fires,
    so it would be a bit easier to manage subscriptions

  Idea: event map objects. like
    {
      [ON_GROUP_DAMAGED]: (event) => ...,
      [ON_FIGHT_ENDS]: (event) => ...,
    }

  Might be better than having all sorts of switches
*/

@Injectable({
  providedIn: 'root'
})
export class BattleEventsService {

  public battleEvents$: Subject<BattleEvents> = new Subject<BattleEvents>();

  constructor() { }

  public dispatchEvent<K extends keyof EventByEnumMapping>(event: EventByEnumMapping[K]): void {
    this.battleEvents$.next(event);
  }

  public listenEventsOfTypes(types: BattleEventTypeEnum[]): Observable<BattleEvents> {
    const typesSet = new Set(types);

    return this.battleEvents$.pipe(filter((event: BattleEvents) => typesSet.has(event.type)));
  }

  public onEvent<K extends keyof EventByEnumMapping>(type: K): Observable<EventByEnumMapping[K]> {
    return this.battleEvents$.pipe(
      filter((event) => event.type === type),
      /* todo: workaround find out if there is better solution */
      map((event) => event as EventByEnumMapping[K]),
    );
  }

  public untilEvent<K extends keyof EventByEnumMapping, T>(type: K): (source: Observable<T>) => Observable<T> {
    return (source$) => source$.pipe(
      takeUntil(this.onEvent(type).pipe(take(1))),
    );
  }
}
