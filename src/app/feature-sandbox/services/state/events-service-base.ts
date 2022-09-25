import { Observable, Subject } from 'rxjs';
import { filter, map, take, takeUntil, tap } from 'rxjs/operators';

function isNullish<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined ? true : false;
}

function filterNullish<T>(source$: Observable<T | null | undefined>): Observable<T> {
  return source$.pipe(
    filter(isNullish),
  );
}


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


export interface EventModel<T extends number | string = number> {
  type: T;
}

export type EventKeys = string | number;
export type EventMap<T extends EventKeys> = Record<T, EventModel<T>>;

/** Events dispatcher base class */
export class EventsServiceBase<
  EventKeyType extends EventKeys,
  EventsMapping extends EventMap<EventKeyType>,
> {
  public events$ = new Subject<EventsMapping[keyof EventsMapping]>();

  public dispatchEvent<K extends keyof EventsMapping>(event: EventsMapping[K]): void {
    this.events$.next(event);
  }

  public listenEventsOfTypes(types: (keyof EventsMapping)[]): Observable<EventsMapping[keyof EventsMapping]> {
    const typesSet: Set<keyof EventsMapping> = new Set(types);

    return this.events$.pipe(filter((event: EventsMapping[keyof EventsMapping]) => typesSet.has(event.type)));
  }

  /* todo: think about it, feels advanced */
  public onEvents(
    handlersByEventType: { [K1 in keyof EventsMapping]?: (event: EventsMapping[K1]) => void },
  ): Observable<EventsMapping[keyof EventsMapping]> {
    type EventsKeys = keyof typeof handlersByEventType;

    type ListenedEvents = EventsMapping[EventsKeys];

    return this.events$
      .pipe(
        filter((event: EventsMapping[keyof EventsMapping]) => event.type in handlersByEventType),
        tap((event: ListenedEvents) => {
          const eventType = event.type as EventsKeys;

          if (eventType in handlersByEventType) {
            const eventHandler = handlersByEventType[eventType];

            if (eventHandler) {
              (eventHandler as (arg: EventsMapping[typeof eventType]) => void)(event);
            }
          }
        })
      );
  }

  public onEvent<K extends keyof EventsMapping>(type: K): Observable<EventsMapping[K]> {
    return this.events$.pipe(
      filter((event) => this.isEventOfType(event, type)),
      /* todo: workaround find out if there is better solution */
      /* type guard. */
      map((event) => event as EventsMapping[K]),
    );
  }

  public untilEvent<K extends keyof EventsMapping, T>(type: K): (source: Observable<T>) => Observable<T> {
    return (source$) => source$.pipe(
      takeUntil(this.onEvent(type).pipe(take(1))),
    );
  }

  private isEventOfType<T extends EventsMapping[keyof EventsMapping]>(event: T, eventType: keyof EventsMapping): event is T {
    return event.type === eventType;
  }
}