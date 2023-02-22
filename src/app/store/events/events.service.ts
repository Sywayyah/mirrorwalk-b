import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { filter } from "rxjs/operators";
import { EventInfo, EventType } from "./events";

interface HandlerDescriber<T extends object = object> {
  event: EventType<T>,
  fn: (data: T) => void,
}

export function on<T extends object>(
  eventType: EventType<T>,
  handler: (data: T) => void
): HandlerDescriber<T> {
  return {
    event: eventType,
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
  public eventStream$ = new Subject<EventInfo>();

  public dispatch(event: EventInfo): void {
    this.eventStream$.next(event);
  }

  constructor() { }

  public onEvent<T extends object>(event: EventType<T>): Observable<T> {
    return this.eventStream$.pipe(
      filter((e) => e.__id === event.__info.__id),
    ) as Observable<T>;
  }


  // this.events(
  //   on(UnitDies, ({ unitGroup }) => { }),
  //   on(UnitAttacks, ({ target }) => { }),
  // );

  public events(...listeners: HandlerDescriber<any>[]): Observable<EventInfo> {
    const handlersByIdsMap = new Map();

    listeners.forEach((listener) => handlersByIdsMap.set(listener.event.__info.__id, listener.fn));

    return this.eventStream$.pipe(
      filter((event) => {
        const handlerFn = handlersByIdsMap.get(event.__id);

        if (handlerFn) {
          handlerFn(event);

          return true;
        }

        return false;
      }),
    );
  }
}
