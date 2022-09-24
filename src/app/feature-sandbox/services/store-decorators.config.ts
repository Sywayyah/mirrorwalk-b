import { Type, inject, OnDestroy } from "@angular/core";
import { BattleEventsService } from "./mw-battle-events.service";
import { BattleEvent, EventByEnumMapping } from "./types";
import { mergeMap, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

export interface Store { };

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

export function StoreClient<T>(storeClass: Type<T>): Type<{ store: T }> {
    return class StoreClient implements OnDestroy {
        /* think on if I can access it somehow from decorators */
        public static [storeEventListeners]: BasicListener[] = [];

        public static [storeClientIndicator]: StoreTypes = 'storeClient';

        /* reference to store class */
        public static [storeClassRef]: Type<T> = storeClass;

        /* store instance, can be used by instance */
        public store: T;

        public destroyed$ = new Subject<void>();
        
        constructor() {
            const self = this;

            this.store = inject(storeClass);

            const ownConstructor = Object.getPrototypeOf(this).constructor;

            (ownConstructor)[storeEventListeners]!.forEach(([event, fn]: [number, Function]) => {
                /* change it to store */
                BattleEventsService.getInstance$()
                    .pipe(
                        mergeMap(instance => instance.onEvent(event as BattleEvent)),
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

export type EventFn<T extends BattleEvent> = ((event: EventByEnumMapping[T], ...rest: any) => any) | (() => any);

export function Event<EventType extends BattleEvent>(event: EventType) {
    return function (
        targetClass: any,
        methodName: string,
        descriptor: TypedPropertyDescriptor<EventFn<EventType>>,
    ): TypedPropertyDescriptor<EventFn<EventType>> | void {
        const method = descriptor.value;

        const targetConstructor = targetClass.constructor;
        const storeClientBaseClass = findStoreClientBaseClass(targetConstructor, 'storeClient');

        if (!storeClientBaseClass) {
            throw new Error(`[Store Feature] Error. Decorator @Event(${event}) was used in ${targetConstructor.name}.${methodName} without @ForStore().`);
        }

        if (typeof method !== 'function') {
            throw new Error(`[Store Feature] Error. Decorator @Event(${event}) in ${targetConstructor.name}.${methodName} must be applied to method.`);
        }

        const config: BasicListener[] = (storeClientBaseClass as unknown as StoreBaseClass)[storeEventListeners];

        config.push([event, method as Function]);

        // descriptor.value = function (this: any, context: EventByEnumMapping[EventType], ...inputs: any) {
        //     // context.myResource.logMetricsEtc(...inputs);
        //     return originalHandler.apply(this, [context, ...inputs]);
        // };

    }
}
