import { Subject } from 'rxjs';

export function complete(destroyed$: Subject<void>): void {
  destroyed$.next();
  destroyed$.complete();
}
