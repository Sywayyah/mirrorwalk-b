import { Type } from "@angular/core";

export const classMembersConfigs = Symbol('Class members configs');
export const classTypeMarker = Symbol('Class type marker');

export type ClassTypeMarkers = 'store';

export type ClassMemberConfig = {
  type: 'wire' | 'notify' | 'subscribeEvent',
  event: any,
  method: Function,
} | { type: 'wire-prop', name: string, event: any };

export function findStoreClientBaseClass<C>(
  childClass: Type<C>,
  type: ClassTypeMarkers
): { [classTypeMarker]: ClassTypeMarkers, [classMembersConfigs]: ClassMemberConfig[] } | null {
  const parentProto = Object.getPrototypeOf(childClass);

  if (!parentProto) {
    return null;
  }

  return parentProto[classTypeMarker] === type
    ? parentProto
    : findStoreClientBaseClass(parentProto, type);
}
