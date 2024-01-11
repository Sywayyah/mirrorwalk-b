import { DestroyRef, inject } from '@angular/core';
import { InputsService } from '../inputs.service';

export function onEscape(action: () => void): void {
  const subscription = inject(InputsService).escape$.subscribe(() => action());
  inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
}
