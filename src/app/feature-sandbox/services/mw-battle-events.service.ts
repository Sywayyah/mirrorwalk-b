import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UnitGroupModel } from 'src/app/core/model/main.model';

export enum BattleEventTypeEnum {
  On_Group_Damaged,
}

export interface BattleEventModel {
  type: BattleEventTypeEnum;
}

export interface GroupDamagedEvent extends BattleEventModel {
  type: BattleEventTypeEnum.On_Group_Damaged;
  attackerGroup: UnitGroupModel;
  attackedGroup: UnitGroupModel;
  loss: number;
}

export interface EventByEnumMapping {
  [BattleEventTypeEnum.On_Group_Damaged]: GroupDamagedEvent;
}

type BattleEvents = EventByEnumMapping[keyof EventByEnumMapping];

/*
  todo: I have a feeling that I want to have such events system.
    because I might want to be able to listen different events 
    across the game. And maybe I want other systems to kind of
    depend on it;

    I'm not sure what kind of approach I'd like to use, for now
    I have one stream for all sorts of events;

  Also an idea is to listenUntil some other event fires,
    so it would be a bit easier to manage subscriptions

  I feel that I like the idea of having event systems, kind of
    helps to distribute logic easier
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

  public listenEventsOfTypes(types: BattleEventTypeEnum[]): Observable<BattleEventModel> {
    const typesSet = new Set(types);

    return this.battleEvents$.pipe(filter((event: BattleEventModel) => typesSet.has(event.type)));
  }

  public onEvent<K extends keyof EventByEnumMapping>(type: K): Observable<EventByEnumMapping[K]> {
    return this.battleEvents$.pipe(
      filter((event) => event.type === type)
    );
  }
}
