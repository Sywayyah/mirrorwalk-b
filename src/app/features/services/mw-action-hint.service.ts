import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActionHintModel } from 'src/app/core/ui';

// Maybe remove this service one day and
// transfer this logic to events
@Injectable({
  providedIn: 'root',
})
export class ActionHintService {
  public readonly hintMessage$: BehaviorSubject<ActionHintModel | null> = new BehaviorSubject<ActionHintModel | null>(null);

  public readonly disableActionHint$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}
