import { EventData, EventGroup, EventHandlersMap } from 'src/app/store';
import { PlayersApi } from '../api/game-api';

export interface LocalEvents<T extends EventGroup<any>> {
  on: (handlers: EventHandlersMap<T>) => void;
}

export interface GameApi {
  events: {
    dispatch(event: EventData): void;
  },
  players: PlayersApi,
}

export type Trigger<T> = {
  fn: (data: T, gameApi: GameApi) => void,
}
