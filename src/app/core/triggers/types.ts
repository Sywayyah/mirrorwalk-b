import { EventGroup, EventHandlersMap } from 'src/app/store';
import { GlobalEventsApi, PlayersApi } from '../api/game-api';
import { Player } from '../players';
import { MapStructure } from '../structures';
import { Town } from '../towns';

export interface LocalEvents<T extends EventGroup<any>> {
  on: (handlers: EventHandlersMap<T>) => void;
}

export interface GameApi {
  events: GlobalEventsApi;
  players: PlayersApi;
  actions: {
    getMapStructures(): MapStructure[];
    getActionPointsLeft(): number;
    scheduleAction(action: () => void, days: number): void;
    getTownOfPlayer(player: Player): Town<any> | undefined;
  };
}

export type Trigger<T> = {
  fn: (data: T, gameApi: GameApi) => void;
};
