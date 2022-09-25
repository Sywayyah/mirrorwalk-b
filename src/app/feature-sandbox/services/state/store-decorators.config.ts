import { inject, OnDestroy, Type } from "@angular/core";
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EventKeys, EventMap, EventsServiceBase } from "./events-service-base";

/* Also, StoreSegment? */
export interface StoreSegment<T> {

}

export interface Store<T,
  EventsKeyT extends EventKeys,
  EventsMapT extends EventMap<EventsKeyT>,
  Events extends EventsServiceBase<EventsKeyT, EventsMapT>
> {
  state: T;

  events: Events;
  getState: () => T;

  onEvent: (eventName: any) => Observable<void>;
};

/*
  next:
   - try to develop store
   - @State() param decorators? 
*/

type StoreTypes = 'storeClient';

const storeClassRef = Symbol(`Client's store class reference`);
const storeEventListeners = Symbol('Store client event listeners');
const storeClientIndicator = Symbol('Store class indicator for decorators');

type BasicListener = [number, Function];
type StoreBaseClass = { [storeEventListeners]: BasicListener[] };

interface IStoreClient<
  StateT,
  EventsKeyT extends EventKeys,
  EventsMapT extends EventMap<EventsKeyT>,
  EventsServiceT extends EventsServiceBase<EventsKeyT, EventsMapT>,
  StoreT extends Store<StateT, EventsKeyT, EventsMapT, EventsServiceT>
> {
  store: StoreT;

  events(): StoreT['events'];
}

export function StoreClient<
  StateT,
  EventKeysT extends EventKeys,
  EventsMapT extends EventMap<EventKeysT>,
  EventsServiceT extends EventsServiceBase<EventKeysT, EventsMapT>,
  StoreT extends Store<StateT, EventKeysT, EventsMapT, EventsServiceT>
>(storeClass: Type<StoreT>): Type<IStoreClient<StateT, EventKeysT, EventsMapT, EventsServiceT, StoreT>> {
  return class StoreClient implements OnDestroy {
    public static [storeEventListeners]: BasicListener[] = [];

    public static [storeClientIndicator]: StoreTypes = 'storeClient';

    /* reference to store class */
    public static [storeClassRef]: Type<StoreT> = storeClass;

    /* store instance, can be used by instance */
    public store: StoreT;

    public destroyed$ = new Subject<void>();

    constructor() {
      const self = this;

      this.store = inject(storeClass);

      const ownConstructor = Object.getPrototypeOf(this).constructor;

      (ownConstructor)[storeEventListeners]!.forEach(([event, fn]: [number, Function]) => {
        this.store.onEvent(event)
          .pipe(
            this.untilDestroyed.bind(self),
          )
          .subscribe(val => {
            fn.apply(this, [val]);
          });
      });
    }

    public ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
    }

    public events(): StoreT['events'] {
      return this.store.events;
    }

    public untilDestroyed<T>(source$: Observable<T>): Observable<T> {
      return source$.pipe(
        takeUntil(this.destroyed$),
      );
    }
  }
}

function findStoreClientBaseClass<C>(childClass: Type<C>, type: StoreTypes): Type<{ [storeClientIndicator]: StoreTypes, [storeEventListeners]: BasicListener[] }> | null {
  const parentProto = Object.getPrototypeOf(childClass);

  if (!parentProto) {
    return null;
  }

  return parentProto[storeClientIndicator] === type
    ? parentProto
    : findStoreClientBaseClass(parentProto, type);
}

/**
 * Store client method decorator. Allows method to be triggered when event or events occur, without
 * receiving any parameters.
*/
export function Notify() {

}

/**
  Method decorator for store clients. Allows method to be automatically called 
    when store event happens, also receiving the data from it. Execution will
    automatically stop when store client is destroyed by Angular.
*/
export function WireEvent<
  EventKeyT extends EventKeys,
  EventMapT extends EventMap<EventKeyT>,
  BaseClass extends IStoreClient<any, EventKeyT, EventMapT, any, any>
>(event: EventKeyT) {
  return function <EventArg extends EventMapT[EventKeyT]>(
    targetClass: BaseClass,
    methodName: string,
    descriptor: TypedPropertyDescriptor<(event: EventArg, ...rest: any) => void>
  ) {

    const method = descriptor.value;

    const targetConstructor = targetClass.constructor as Type<BaseClass>;
    const storeClientBaseClass = findStoreClientBaseClass(targetConstructor, 'storeClient');

    if (!storeClientBaseClass) {
      throw new Error(`[Store Feature] Error. Decorator @WireEvent(${event as string}) was used in ${targetConstructor.name}.${methodName} without @ForStore().`);
    }

    if (typeof method !== 'function') {
      throw new Error(`[Store Feature] Error. Decorator @WireEvent(${event as string}) in ${targetConstructor.name}.${methodName} must be applied to method.`);
    }

    const config: BasicListener[] = (storeClientBaseClass as unknown as StoreBaseClass)[storeEventListeners];

    config.push([event as number, method as Function]);
  }
}
