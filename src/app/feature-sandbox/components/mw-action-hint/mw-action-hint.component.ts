import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BattleStateService, MwPlayersService } from '../../services';
import { RoundPlayerTurnStarts } from '../../services/events';
import { EventsService } from '../../services/state';
import { ActionHintModel, ActionHintTypeEnum } from '../../services/types/action-hint.types';

@Component({
  selector: 'mw-action-hint',
  templateUrl: './mw-action-hint.component.html',
  styleUrls: ['./mw-action-hint.component.scss']
})
export class MwActionHintComponent implements OnInit {

  public hintActionTypes: typeof ActionHintTypeEnum = ActionHintTypeEnum;

  public hint$: BehaviorSubject<ActionHintModel | null> = new BehaviorSubject<ActionHintModel | null>(null);

  constructor(
    public readonly mwBattleState: BattleStateService,
    public readonly players: MwPlayersService,
    public events: EventsService,
  ) {
    /* couldn't via async, because events are subject */
    // this.battleEvents.onEvent(BattleEvent.Round_Player_Turn_Starts).subscribe(event => {event.});

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
    ).subscribe();
  }

  ngOnInit(): void {
  }
}
