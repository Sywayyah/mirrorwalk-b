export function hasProp<T extends object>(obj: T, prop: any): prop is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
