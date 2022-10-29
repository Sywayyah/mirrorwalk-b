import { inject, OnDestroy, Type } from "@angular/core";
import { Observable, Subject, Subscription } from 'rxjs';
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
   - support for events array...
*/

type StoreTypes = 'storeClient';

const storeClassRef = Symbol(`Client's store class reference`);
const storeEventListeners = Symbol('Store client event listeners');
const storeClientIndicator = Symbol('Store class indicator for decorators');

type ClassPropertyConfig = { type: 'wire' | 'notify' | 'subscribeEvent', event: number, method: Function };

type StoreBaseClass = { [storeEventListeners]: ClassPropertyConfig[] };

/** @deprecated */
interface IStoreClient<
  StateT,
  EventsKeyT extends EventKeys,
  EventsMapT extends EventMap<EventsKeyT>,
  EventsServiceT extends EventsServiceBase<EventsKeyT, EventsMapT>,
  StoreT extends Store<StateT, EventsKeyT, EventsMapT, EventsServiceT>
> extends OnDestroy {
  store: StoreT;

  events(): StoreT['events'];

  onDestroyed?(): void;
}

/** @deprecated */
export function StoreClient<
  StateT,
  EventKeysT extends EventKeys,
  EventsMapT extends EventMap<EventKeysT>,
  EventsServiceT extends EventsServiceBase<EventKeysT, EventsMapT>,
  StoreT extends Store<StateT, EventKeysT, EventsMapT, EventsServiceT>
>(storeClass: Type<StoreT>): Type<IStoreClient<StateT, EventKeysT, EventsMapT, EventsServiceT, StoreT>> {
  return class StoreClient implements OnDestroy {
    public static [storeEventListeners]: ClassPropertyConfig[] = [];

    public static [storeClientIndicator]: StoreTypes = 'storeClient';

    /* reference to store class */
    public static [storeClassRef]: Type<StoreT> = storeClass;

    /* store instance, can be used by instance */
    public store: StoreT;

    public destroyed$ = new Subject<void>();

    public onDestroyed?: () => void;

    private plainSubscriptions = new Subscription();

    constructor() {
      const self = this;

      this.store = inject(storeClass);

      const ownConstructor = Object.getPrototypeOf(this).constructor;

      ((ownConstructor)[storeEventListeners] as ClassPropertyConfig[]).forEach(config => {
        const method = config.method;

        switch (config.type) {
          case 'wire':
            this.store.onEvent(config.event)
              .pipe(
                this.untilDestroyed.bind(self),
              )
              .subscribe(val => {
                method.apply(this, [val]);
              });
            break;
          case 'notify':
            this.store.onEvent(config.event)
              .pipe(
                this.untilDestroyed.bind(self),
              )
              .subscribe(() => {
                method.apply(this);
              });
            break;
          case 'subscribeEvent':
            const subscription: Subscription = method.apply(self, [this.store.onEvent(config.event)]);

            this.plainSubscriptions.add(subscription);

            break;
        }
      });
    }

    public ngOnDestroy(): void {
      this.onDestroyed?.();
      this.destroyed$.next();
      this.destroyed$.complete();
      this.plainSubscriptions.unsubscribe();
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

function findStoreClientBaseClass<C>(childClass: Type<C>, type: StoreTypes): Type<{ [storeClientIndicator]: StoreTypes, [storeEventListeners]: ClassPropertyConfig[] }> | null {
  const parentProto = Object.getPrototypeOf(childClass);

  if (!parentProto) {
    return null;
  }

  return parentProto[storeClientIndicator] === type
    ? parentProto
    : findStoreClientBaseClass(parentProto, type);
}

function decorateStoreClientMethod<BaseClass>(
  targetClass: object,
  methodName: string,
  descriptor: PropertyDescriptor,
  event: string | number,
  messageName: string,
  configType: ClassPropertyConfig['type'],
) {
  const method = descriptor.value;

  const targetConstructor = targetClass.constructor as Type<BaseClass>;
  const storeClientBaseClass = findStoreClientBaseClass(targetConstructor, 'storeClient');

  if (!storeClientBaseClass) {
    throw new Error(`[Store Feature] Error. Decorator ${messageName} was used in ${targetConstructor.name}.${methodName} without @ForStore().`);
  }

  if (typeof method !== 'function') {
    throw new Error(`[Store Feature] Error. Decorator ${messageName} in ${targetConstructor.name}.${methodName} must be applied to method.`);
  }

  const config: ClassPropertyConfig[] = (storeClientBaseClass as unknown as StoreBaseClass)[storeEventListeners];

  config.push({
    type: configType,
    method: method,
    event: event as number,
  });
}

/**
 * Store client method decorator. Allows method to be triggered when event or events occur, without
 * receiving any parameters.
*/
export function Notify<
  EventKeyT extends EventKeys,
  EventMapT extends EventMap<EventKeyT>,
  BaseClass extends IStoreClient<any, EventKeyT, EventMapT, any, any>
>(event: EventKeyT) {
  return function (
    targetClass: object,
    methodName: string,
    descriptor: PropertyDescriptor,
  ) {
    decorateStoreClientMethod<BaseClass>(
      targetClass,
      methodName,
      descriptor,
      event,
      `@Notify(${event})`,
      'notify'
    );
  };
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
    decorateStoreClientMethod<BaseClass>(
      targetClass,
      methodName,
      descriptor,
      event,
      `@WireEvent(${event as string})`,
      'wire',
    );
  }
}

/**
 * Observable of this event will be passed as first argument, returned Subscrition will be
 * handled automatically.
 */
export function SubscribeEvent<
  EventKeyT extends EventKeys,
  EventMapT extends EventMap<EventKeyT>,
  BaseClass extends IStoreClient<any, EventKeyT, EventMapT, any, any>
>(
  event: EventKeyT,
) {
  return function <EventArg extends EventMapT[EventKeyT]>(
    targetClass: BaseClass,
    methodName: string,
    descriptor: TypedPropertyDescriptor<(event: Observable<EventArg>, ...rest: any) => Subscription>
  ) {
    decorateStoreClientMethod<BaseClass>(
      targetClass,
      methodName,
      descriptor,
      event,
      `@SubscribeEvent(${event as string})`,
      'subscribeEvent',
    );
  }
}
