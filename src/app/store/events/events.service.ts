import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { filter } from "rxjs/operators";
import { EventData, EventType } from "./events";
import { Config } from 'src/app/core/config';

interface HandlerDescriber<T extends object = object> {
  eventType: EventType<T>,
  fn: (data: T) => void,
}

export function on<T extends object>(
  eventType: EventType<T>,
  handler: (data: T) => void
): HandlerDescriber<T> {
  return {
    eventType: eventType,
    fn: handler,
  };
}

/*
 For the future:
  Instead of having 1 stream with many filters, there might be per-event observables map,
  this might improve performance.

  Some logging could be great.
*/

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  public eventStream$ = new Subject<EventData>();

  public dispatch(event: EventData): void {
    // console.log(`  ${event.__name}`, event);
    this.eventStream$.next(event);
  }

  constructor() {
    // rethink events logging later on
    if (Config.logEvents) {
      this.eventStream$.subscribe(event => console.log(`[${event.__eventType.__name}]`, event));
    }
  }

  public onEvent<T extends object>(eventType: EventType<T>): Observable<T> {
    return this.eventStream$.pipe(
      filter((e) => e.__eventType.__id === eventType.__typeInfo.__id),
    ) as Observable<T>;
  }


  // this.events(
  //   on(UnitDies, ({ unitGroup }) => { }),
  //   on(UnitAttacks, ({ target }) => { }),
  // );

  public events(...listeners: HandlerDescriber<any>[]): Observable<EventData> {
    const handlersByIdsMap = new Map();

    listeners.forEach((listener) => handlersByIdsMap.set(listener.eventType.__typeInfo.__id, listener.fn));

    return this.eventStream$.pipe(
      filter((event) => {
        const handlerFn = handlersByIdsMap.get(event.__eventType.__id);

        if (handlerFn) {
          handlerFn(event);

          return true;
        }

        return false;
      }),
    );
  }
}
