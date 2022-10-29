import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BattleEventModel, BattleEventsService, BattleEvent, BattleStateService, MwPlayersService, CombatInteractionState, CombatInteractionEnum } from '../../services';
import { EventsService } from '../../services/state';
import { RoundPlayerTurnStarts } from '../../services/state-values/battle-events';
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
    public newEvents: EventsService,
  ) {
    /* couldn't via async, because events are subject */
    // this.battleEvents.onEvent(BattleEvent.Round_Player_Turn_Starts).subscribe(event => {event.});

    combineLatest([
      // this.battleEvents.onEvent(BattleEvent.Round_Player_Turn_Starts),
      this.newEvents.onEvent(RoundPlayerTurnStarts),
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
