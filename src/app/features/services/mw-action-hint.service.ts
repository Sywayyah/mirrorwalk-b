import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActionHintVariants } from 'src/app/core/ui';

// Maybe remove this service one day and
// transfer this logic to events
@Injectable({
  providedIn: 'root',
})
export class ActionHintService {
  readonly hintMessage$ = new BehaviorSubject<ActionHintVariants['variants'] | null>(null);

  readonly disableActionHint$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}
