import { EventInfo } from 'src/app/store';

export interface GameApi {
  events: {
    dispatch(event: EventInfo): void;
  }
}

export type Trigger<T> = {
  fn: (data: T, gameApi: GameApi) => void,
}
