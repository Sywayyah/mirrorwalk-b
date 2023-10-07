import { EventGroup, EventHandlersMap } from 'src/app/store';
import { GlobalEventsApi, PlayersApi } from '../api/game-api';

export interface LocalEvents<T extends EventGroup<any>> {
  on: (handlers: EventHandlersMap<T>) => void;
}

export interface GameApi {
  events: GlobalEventsApi,
  players: PlayersApi,
  actions: {
    getActionPointsLeft(): number;
  },
}

export type Trigger<T> = {
  fn: (data: T, gameApi: GameApi) => void,
}
