import { DestroyRef, inject } from '@angular/core';
import { NavigateToView, ViewsEnum } from 'src/app/core/events';
import { EventsService } from 'src/app/store';
import { InputsService } from '../inputs.service';

export function escapeToView(targetView: ViewsEnum): void {
  const events = inject(EventsService);

  const subscription = inject(InputsService)
    .escape$
    .subscribe(() => events.dispatch(NavigateToView({ view: targetView })));

  inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
}
