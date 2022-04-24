import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { BattleEvents, EventByEnumMapping, BattleEventTypeEnum } from './types';

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
