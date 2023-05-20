import { EventData } from 'src/app/store';
import { PlayersApi } from '../api/game-api';

export interface GameApi {
  events: {
    dispatch(event: EventData): void;
  },
  players: PlayersApi,
}

export type Trigger<T> = {
  fn: (data: T, gameApi: GameApi) => void,
}
