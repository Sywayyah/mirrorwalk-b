import { SimpleChanges } from '@angular/core';

export type TypedChange<T> = {
    currentValue: T;
    previousValue: T;
    firstChange: boolean;
    isFirstChange(): boolean;
}

/* May be preferred over Angular's SimpleChanges for better autocompletion and refactoring */
export type TypedChanges<T> = SimpleChanges & {
    [P in keyof T]?: TypedChange<T[P]>;
};


export type KeysMatching<T extends object, V> = {
    [K in keyof T]-?: T[K] extends V ? K : never
}[keyof T];
