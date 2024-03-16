export function hasProp<T extends object>(obj: T, prop: any): prop is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export type Entries<T> = {
  [K in keyof T]-?: [K, T[K]];
}[keyof T][];

export const getEntries = <T extends object>(obj: T) => Object.entries(obj) as Entries<T>;

export const getKeys = <T extends object>(obj: T) => Object.keys(obj) as (keyof T)[];

export function nonNullish<T>(val: T | null | undefined): val is T {
  return val !== null && val !== undefined;
}

export function infNum(num: number): number | string {
  return num === Infinity ? '∞' : num;
}
