import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { ActionHintModel, ActionHintTypeEnum } from 'src/app/core/ui';
import { MwPlayersService } from 'src/app/features/services';
import { ActionHintService } from 'src/app/features/services/mw-action-hint.service';
import { EventsService } from 'src/app/store';

@Component({
  selector: 'mw-action-hint',
  templateUrl: './mw-action-hint.component.html',
  styleUrls: ['./mw-action-hint.component.scss']
})
export class MwActionHintComponent implements OnDestroy {

  public hintActionTypes: typeof ActionHintTypeEnum = ActionHintTypeEnum;

  public hint$: BehaviorSubject<ActionHintModel | null> = new BehaviorSubject<ActionHintModel | null>(null);

  private destroyed$ = new Subject<void>();

  constructor(
    // public readonly mwBattleState: BattleStateService,
    public readonly players: MwPlayersService,
    public events: EventsService,
    public readonly actionHintService: ActionHintService,
  ) {
    // need to revisit this logic. it was designed mostly for battleground.
    combineLatest([
      this.actionHintService.disableActionHint$,
      this.actionHintService.hintMessage$,
    ]).pipe(
      map(([disabled, actionHint]) => {
        if (disabled) {
          return null;
        }

        return actionHint;
      }),
      tap(actionHint => this.hint$.next(actionHint)),
      takeUntil(this.destroyed$),
    ).subscribe();
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
