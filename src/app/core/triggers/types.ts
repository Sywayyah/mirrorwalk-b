import { EventGroup, EventHandlersMap } from 'src/app/store';
import { GlobalEventsApi, PlayersApi } from '../api/game-api';
import { MapStructure } from '../structures';

export interface LocalEvents<T extends EventGroup<any>> {
  on: (handlers: EventHandlersMap<T>) => void;
}

export interface GameApi {
  events: GlobalEventsApi,
  players: PlayersApi,
  actions: {
    getMapStructures(): MapStructure[];
    getActionPointsLeft(): number;
  },
}

export type Trigger<T> = {
  fn: (data: T, gameApi: GameApi) => void,
}
