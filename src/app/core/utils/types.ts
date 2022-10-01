import { SimpleChanges } from "@angular/core";

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