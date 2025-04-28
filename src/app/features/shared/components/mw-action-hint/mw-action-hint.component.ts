import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ActionHintModel, ActionHintTypeEnum } from 'src/app/core/ui';
import { injectHostElem } from 'src/app/core/utils';
import { ActionHintService } from 'src/app/features/services/mw-action-hint.service';

@Component({
  selector: 'mw-action-hint',
  templateUrl: './mw-action-hint.component.html',
  styleUrls: ['./mw-action-hint.component.scss'],
  standalone: false,
})
export class MwActionHintComponent {
  private readonly actionHintService = inject(ActionHintService);
  private readonly hostElem = injectHostElem();

  readonly hintActionTypes: typeof ActionHintTypeEnum = ActionHintTypeEnum;

  readonly hint$: BehaviorSubject<ActionHintModel | null> = new BehaviorSubject<ActionHintModel | null>(null);

  constructor() {
    // need to revisit this logic. it was designed mostly for battleground.
    combineLatest([this.actionHintService.disableActionHint$, this.actionHintService.hintMessage$])
      .pipe(
        map(([disabled, actionHint]) => {
          if (disabled) {
            return null;
          }

          return actionHint;
        }),
        tap((actionHint) => {
          this.hostElem.classList.toggle('hidden', !actionHint);
          this.hint$.next(actionHint);
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }
}
