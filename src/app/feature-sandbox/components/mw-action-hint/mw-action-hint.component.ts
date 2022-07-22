import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BattleEventModel, BattleEventsService, BattleEventTypeEnum, BattleStateService, MwPlayersService } from '../../services';
import { ActionHintModel, ActionHintTypeEnum } from '../../services/types/action-hint.types';

@Component({
  selector: 'mw-action-hint',
  templateUrl: './mw-action-hint.component.html',
  styleUrls: ['./mw-action-hint.component.scss']
})
export class MwActionHintComponent implements OnInit {

  public hintActionTypes: typeof ActionHintTypeEnum = ActionHintTypeEnum;
  public actionHint: BattleEventModel | null = null;

  public hint$: BehaviorSubject<ActionHintModel | null> = new BehaviorSubject<ActionHintModel | null>(null);

  constructor(
    public readonly mwBattleState: BattleStateService,
    public readonly battleEvents: BattleEventsService,
    public readonly players: MwPlayersService,
  ) {
    /* couldn't via async, because events are subject */
    combineLatest([
      this.battleEvents.onEvent(BattleEventTypeEnum.Round_Player_Turn_Starts),
      this.mwBattleState.hintMessage$,
    ]).pipe(
      map(([playerTurnEvent, actionHint]) => {
        if (playerTurnEvent.currentPlayer !== this.players.getCurrentPlayer()) {
          return null;
        }

        return actionHint;
      }),
      tap(actionHint => this.hint$.next(actionHint)),
    ).subscribe();
  }

  ngOnInit(): void {
  }
}
