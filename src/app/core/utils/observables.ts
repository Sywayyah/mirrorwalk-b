import { DestroyRef, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export function complete(destroyed$: Subject<void>): void {
  destroyed$.next();
  destroyed$.complete();
}

export function onDestroy(): {
  destroyRef: DestroyRef;
  destroyed$: Subject<void>;
  until<T>(): (source$: Observable<T>) => Observable<T>;
} {
  const destroyRef = inject(DestroyRef);
  const destroyed$ = new Subject<void>();

  destroyRef.onDestroy(() => complete(destroyed$));

  return {
    destroyRef,
    destroyed$,
    until<T>(): (source$: Observable<T>) => Observable<T> {
      return function (source$: Observable<T>): Observable<T> {
        return source$.pipe(takeUntil(destroyed$));
      };
    },
  };
}
