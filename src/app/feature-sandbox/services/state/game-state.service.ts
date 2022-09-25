import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BattleEventsService } from '../mw-battle-events.service';
import { Store } from './store-decorators.config';

interface GameStateModel {
  count?: number;
}

@Injectable({
  providedIn: 'root'
})
export class GameStore implements Store<GameStateModel> {

  state: GameStateModel = {

  };

  events = new Subject<void>();


  constructor(
    private battleEvents: BattleEventsService,
  ) {

  }

  public getState(): GameStateModel {
    return this.state;
  }


}
