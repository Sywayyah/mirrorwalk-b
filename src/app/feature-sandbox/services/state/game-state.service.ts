import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BattleEventsService } from '../mw-battle-events.service';
import { Store } from './store-decorators.config';

interface GameStateModel {
  count?: number;
}

@Injectable({
  providedIn: 'root'
})
export class GameStore implements Store<GameStateModel, BattleEventsService> {
  public state: GameStateModel = {
  };

  public events: BattleEventsService;

  constructor(
    private battleEvents: BattleEventsService,
  ) {
    this.events = battleEvents;
  }

  public getState(): GameStateModel {
    return this.state;
  }

  public onEvent(eventName: any): Observable<any> {
    return this.battleEvents.onEvent(eventName);
  }
}
