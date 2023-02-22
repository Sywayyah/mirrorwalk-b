import { Type } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { EventType } from "../events/events";
import { classMembersConfigs, findStoreClientBaseClass } from "./config";


export function WireFn<T extends object>(event: EventType<T>) {
  return function (
    targetClass: object,
    propName: string,
  ) {
    const classConstructor = targetClass.constructor as Type<any>;

    const storeClass = findStoreClientBaseClass(classConstructor, 'store');

    if (!storeClass) {
      throw new Error('Store class was not found');
    }

    const membersConfigs = storeClass[classMembersConfigs];

    membersConfigs.push({
      type: 'wire-prop',
      event: event,
      name: propName,
    })
  };
}

function decorateStoreClientMethod<T extends object>(
  targetClass: object,
  methodName: string,
  descriptor: PropertyDescriptor,
  event: EventType<T>,
  decoratorName: string,
  configType: 'wire' | 'notify' | 'subscribeEvent',
) {
  const method = descriptor.value;

  const targetConstructor = targetClass.constructor as Type<any>;

  const storeClass = findStoreClientBaseClass(targetConstructor, 'store');

  if (!storeClass) {
    throw new Error(`[Store Feature] ${decoratorName} Error. Class ${targetConstructor.name} must extend StoreClient(). Method ${targetConstructor.name}.${methodName}.`);
  }

  if (typeof method !== 'function') {
    throw new Error(`[Store Feature] ${decoratorName} Error. ${decoratorName} in ${targetConstructor.name}.${methodName} must be applied to method.`);
  }

  const membersConfigs = storeClass[classMembersConfigs];

  membersConfigs.push({
    type: configType,
    method: method,
    event: event,
  });
}

/**
 * Store client method decorator. Allows method to be triggered when event or events occur without
 * receiving any parameters.
*/
export function Notify<T extends object>(event: EventType<T>) {
  return function (
    targetClass: object,
    methodName: string,
    descriptor: PropertyDescriptor,
  ) {
    decorateStoreClientMethod(
      targetClass,
      methodName,
      descriptor,
      event,
      `@Notify(${event.name})`,
      'notify'
    );
  };
}

/**
  Method decorator for store clients. Allows method to be automatically called
    when store event happens, also receiving the data from it. Subscription will
    automatically stop with ngOnDestroy.
*/
export function WireMethod<T extends object>(event: EventType<T>) {
  return function (
    targetClass: object,
    methodName: string,
    descriptor: TypedPropertyDescriptor<(event: T, ...rest: any) => void>
  ) {
    decorateStoreClientMethod(
      targetClass,
      methodName,
      descriptor,
      event,
      `@WireEvent(${event.name})`,
      'wire',
    );
  }
}

/**
 * Observable of this event will be passed as first argument, returned Subscrition will be
 * handled automatically.
 */
export function SubscribeEvent<T extends object>(event: EventType<T>) {
  return function (
    targetClass: object,
    methodName: string,
    descriptor: TypedPropertyDescriptor<(event: Observable<EventType<T>>, ...rest: any) => Subscription>
  ) {
    decorateStoreClientMethod(
      targetClass,
      methodName,
      descriptor,
      event,
      `@SubscribeEvent(${event.name})`,
      'subscribeEvent',
    );
  }
}
