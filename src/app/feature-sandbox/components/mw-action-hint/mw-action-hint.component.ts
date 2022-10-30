import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { BattleStateService, MwPlayersService } from '../../services';
import { RoundPlayerTurnStarts } from '../../services/events';
import { EventsService } from '../../services/store';
import { ActionHintModel, ActionHintTypeEnum } from '../../services/types/action-hint';

@Component({
  selector: 'mw-action-hint',
  templateUrl: './mw-action-hint.component.html',
  styleUrls: ['./mw-action-hint.component.scss']
})
export class MwActionHintComponent implements OnInit {

  public hintActionTypes: typeof ActionHintTypeEnum = ActionHintTypeEnum;

  public hint$: BehaviorSubject<ActionHintModel | null> = new BehaviorSubject<ActionHintModel | null>(null);

  private destroyed$ = new Subject<void>();

  constructor(
    public readonly mwBattleState: BattleStateService,
    public readonly players: MwPlayersService,
    public events: EventsService,
  ) {
    combineLatest([
      this.events.onEvent(RoundPlayerTurnStarts),
      this.mwBattleState.hintMessage$,
    ]).pipe(
      map(([playerTurnEvent, actionHint]) => {
        if (playerTurnEvent.currentPlayer !== this.players.getCurrentPlayer()) {
          return null;
        }

        return actionHint;
      }),
      tap(actionHint => this.hint$.next(actionHint)),
      takeUntil(this.destroyed$),
    ).subscribe();
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
